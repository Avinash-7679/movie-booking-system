import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SeatSelection = () => {
  const { id } = useParams(); // show_id
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5005/api/movies/shows/${id}/seats`)
      .then(res => res.json())
      .then(data => {
        setSeats(data.seats || []);
        // Ensure bookedSeatIds are always integers for strict equality checks
        setBookedSeatIds((data.bookedSeatIds || []).map(Number));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load seats:', err);
        setError('Failed to load seats. Please try again.');
        setLoading(false);
      });
  }, [id]);

  const toggleSeat = (seatId) => {
    const numericSeatId = Number(seatId); // Ensure integer comparison
    if (bookedSeatIds.includes(numericSeatId)) return;
    
    if (selectedSeatIds.includes(numericSeatId)) {
      setSelectedSeatIds(selectedSeatIds.filter(s => s !== numericSeatId));
    } else {
      setSelectedSeatIds([...selectedSeatIds, numericSeatId]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeatIds.length === 0) return;
    
    const token = localStorage.getItem('token');

    if (!token || token === 'null' || token === 'undefined') {
      navigate('/login');
      return;
    }

    // ✅ FIX: Convert show_id from string (useParams) to integer
    const showIdInt = parseInt(id, 10);
    // ✅ FIX: Ensure all seat_ids are integers
    const seatIdsInt = selectedSeatIds.map(Number);
    const totalPrice = seatIdsInt.length * 200;

    const payload = {
      show_id: showIdInt,
      seat_ids: seatIdsInt,
      total_price: totalPrice
    };

    console.log('[Booking] Sending payload:', payload);
    console.log('[Booking] Token present:', !!token);

    try {
      const res = await fetch('http://localhost:5005/api/bookings/book-ticket', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('[Booking] Response:', res.status, data);
      
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      
      navigate(`/booking/${data.booking_id}/confirmation`);
    } catch (err) {
      console.error('[Booking] Error:', err.message);
      setError(err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center' }}>Loading seats...</div>;

  return (
    <div>
      <h1 className="page-title">Select Your Seats</h1>
      {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="glass-card screen-container">
        <div className="screen-visual"></div>
        <div className="seats-grid">
          {seats.map(seat => {
            const isBooked = bookedSeatIds.includes(seat.seat_id);
            const isSelected = selectedSeatIds.includes(seat.seat_id);
            
            let seatClass = 'seat available';
            if (isBooked) seatClass = 'seat booked';
            else if (isSelected) seatClass = 'seat selected';

            return (
              <div 
                key={seat.seat_id} 
                className={seatClass}
                onClick={() => toggleSeat(seat.seat_id)}
                title={`${seat.seat_number} - ${seat.seat_type}`}
              >
                {seat.seat_number}
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat available" style={{ width: '20px', height: '20px' }}></div> Available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat booked" style={{ width: '20px', height: '20px' }}></div> Booked
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="seat selected" style={{ width: '20px', height: '20px' }}></div> Selected
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
          Selected Tickets: <strong style={{ color: 'var(--primary-color)' }}>{selectedSeatIds.length}</strong>
        </p>
        <button 
          className="btn-primary" 
          onClick={handleBooking}
          disabled={selectedSeatIds.length === 0}
        >
          Proceed to Pay ₹{selectedSeatIds.length * 200}
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
