import { Link, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Film size={28} color="#6366f1" />
        <span>Cine</span>Smart
      </Link>
      <div className="navbar-links">
        {token ? (
          <>
            <span style={{ color: 'var(--text-muted)' }}>Hello, {user?.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary-color)', width: 'auto' }}>
              Login
            </Link>
            <Link to="/register" className="btn-primary" style={{ width: 'auto' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
