const db = require('../config/db');

exports.getMovies = async (req, res) => {
    try {
        const [movies] = await db.query('SELECT * FROM Movies');
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getShowsByMovie = async (req, res) => {
    try {
        const { movie_id } = req.params;
        const query = `
            SELECT sh.show_id, sh.show_time, sc.total_seats, t.name as theater_name, t.city, sc.screen_id
            FROM Shows sh
            JOIN Screens sc ON sh.screen_id = sc.screen_id
            JOIN Theaters t ON sc.theater_id = t.theater_id
            WHERE sh.movie_id = ?
        `;
        const [shows] = await db.query(query, [movie_id]);
        res.json(shows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSeatsByShow = async (req, res) => {
    try {
        const { show_id } = req.params;
        
        // 1. Get the screen for this show
        const [shows] = await db.query('SELECT screen_id FROM Shows WHERE show_id = ?', [show_id]);
        if (shows.length === 0) return res.status(404).json({ error: 'Show not found' });
        const screen_id = shows[0].screen_id;

        // 2. Get all seats for the screen
        const [seats] = await db.query('SELECT * FROM Seats WHERE screen_id = ?', [screen_id]);

        // 3. Get booked seats for this show
        const [tickets] = await db.query(`
            SELECT seat_id FROM Tickets t
            JOIN Bookings b ON t.booking_id = b.booking_id
            WHERE b.show_id = ?
        `, [show_id]);
        const bookedSeatIds = tickets.map(t => t.seat_id);

        res.json({
            seats,
            bookedSeatIds
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
