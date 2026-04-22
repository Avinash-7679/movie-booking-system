import { useParams, Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const { id } = useParams();

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="glass-card">
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          background: 'var(--seat-selected)', margin: '0 auto 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', color: 'white',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)'
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Booking Confirmed!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Your booking ID is <strong>#{id}</strong>. A confirmation email has been sent to your registered email address.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
