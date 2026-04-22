const db = require('../config/db');

exports.bookTicket = async (req, res) => {
    let { show_id, seat_ids, total_price } = req.body;
    const user_id = req.user.user_id; // From JWT Auth Middleware

    // ✅ Debug log — helps trace what arrived at the server
    console.log('[bookTicket] Received:', { show_id, seat_ids, total_price, user_id });

    // ✅ Validate all required fields
    if (!show_id) {
        return res.status(400).json({ error: 'Missing required field: show_id' });
    }
    if (!seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
        return res.status(400).json({ error: 'No seats selected or seat_ids is not an array' });
    }
    if (total_price == null || isNaN(total_price)) {
        return res.status(400).json({ error: 'Missing or invalid field: total_price' });
    }

    // ✅ Coerce types (safety net in case frontend sends strings)
    show_id = parseInt(show_id, 10);
    seat_ids = seat_ids.map(Number);
    total_price = parseFloat(total_price);

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Check if any seat is already booked for this show
        const placeholders = seat_ids.map(() => '?').join(',');
        const query = `
            SELECT t.seat_id FROM Tickets t
            JOIN Bookings b ON t.booking_id = b.booking_id
            WHERE b.show_id = ? AND t.seat_id IN (${placeholders})
            FOR UPDATE
        `; // FOR UPDATE locks the rows temporarily during transaction
        
        const [bookedSeats] = await connection.query(query, [show_id, ...seat_ids]);

        if (bookedSeats.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'One or more selected seats are already booked.' });
        }

        // Insert into Bookings
        const [bookingResult] = await connection.query(
            'INSERT INTO Bookings (user_id, show_id, total_price) VALUES (?, ?, ?)',
            [user_id, show_id, total_price]
        );
        const booking_id = bookingResult.insertId;

        // Insert into Tickets
        for (const seat_id of seat_ids) {
            await connection.query(
                'INSERT INTO Tickets (booking_id, seat_id) VALUES (?, ?)',
                [booking_id, seat_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Booking successful', booking_id });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: 'Booking failed: ' + err.message });
    } finally {
        connection.release();
    }
};
