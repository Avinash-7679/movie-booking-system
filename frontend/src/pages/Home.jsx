import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5005/api/movies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          console.error('API Error:', data);
          setMovies([]); // Fallback to empty array
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div style={{ textAlign: 'center' }}>Loading movies...</div>;

  return (
    <div>
      <h1 className="page-title">Now Showing</h1>
      <div className="movie-grid">
        {movies.map(movie => (
          <div key={movie.movie_id} className="glass-card">
            {/* Using a placeholder gradient for the movie poster */}
            <div style={{ height: '200px', background: 'linear-gradient(45deg, #1e293b, #334155)', borderRadius: '8px', marginBottom: '1rem' }}></div>
            <h2 className="movie-title">{movie.title}</h2>
            <div className="movie-meta">
              <span>{movie.genre}</span> • <span>{movie.duration} mins</span> • <span>⭐ {movie.rating}</span>
            </div>
            <Link to={`/movie/${movie.movie_id}`} className="btn-primary">
              Book Tickets
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
