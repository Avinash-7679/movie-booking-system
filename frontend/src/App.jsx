import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShowSelection from './pages/ShowSelection';
import SeatSelection from './pages/SeatSelection';
import BookingConfirmation from './pages/BookingConfirmation';

// Simple Auth check wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<ShowSelection />} />
          <Route path="/show/:id/seats" element={<PrivateRoute><SeatSelection /></PrivateRoute>} />
          <Route path="/booking/:id/confirmation" element={<PrivateRoute><BookingConfirmation /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
