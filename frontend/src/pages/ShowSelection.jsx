import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ShowSelection = () => {
  const { id } = useParams();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5005/api/movies/${id}/shows`)
      .then(res => res.json())
      .then(data => {
        setShows(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading shows...</div>;

  return (
    <div>
      <h1 className="page-title">Available Shows</h1>
      <div className="movie-grid">
        {shows.map(show => (
          <div key={show.show_id} className="glass-card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
              {new Date(show.show_time).toLocaleString()}
            </h3>
            <p className="movie-meta" style={{ marginBottom: '0.5rem' }}>
              <strong>Theater:</strong> {show.theater_name}, {show.city}
            </p>
            <p className="movie-meta">
              <strong>Screen:</strong> {show.screen_id} (Capacity: {show.total_seats})
            </p>
            <Link to={`/show/${show.show_id}/seats`} className="btn-primary" style={{ marginTop: '1rem' }}>
              Select Seats
            </Link>
          </div>
        ))}
        {shows.length === 0 && <p>No shows available for this movie.</p>}
      </div>
    </div>
  );
};

export default ShowSelection;
