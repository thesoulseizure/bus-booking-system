import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Booking from './components/Booking';
import BusList from './components/BusList';
import Profile from './components/Profile';
import Navbar from './components/Navbar'; // Import Navbar
import './App.css';

function App() {
  return (
    <Router basename="/">
      <div>
        <Navbar /> {/* Add Navbar */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buses" element={<BusList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={
            <div className="welcome-container d-flex align-items-center justify-content-center min-vh-100" style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}>
              <div className="text-center text-white p-5 rounded shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                <h1 className="display-4 mb-4">Welcome to Bus Booking System</h1>
                <p className="lead mb-4">Book your bus tickets easily and travel hassle-free!</p>
                <div>
                  <Link to="/login" className="btn btn-primary btn-lg mx-2">Login</Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg mx-2">Register</Link>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;