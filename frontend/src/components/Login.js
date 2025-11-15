// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Use a safe backend base (falls back to current origin)
  const backendBase = process.env.REACT_APP_API_URL || window.location.origin;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `${backendBase}/api/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
          withCredentials: false, // adjust if your backend uses cookies
        }
      );
      const { token } = response.data;
      if (!token) {
        throw new Error('No token received from the server');
      }
      localStorage.setItem('token', token);
      // success UX
      alert('Login successful!');
      navigate('/buses');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err.response ?? err);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}

              {/* dummy hidden field reduces aggressive browser autofill issues */}
              <form onSubmit={handleSubmit} autoComplete="on" noValidate>
                <input
                  type="text"
                  name="fake_username"
                  id="fake_username"
                  autoComplete="off"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                />

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}               // <-- FIXED here
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>

              <p className="mt-3 text-center">
                Don't have an account? <Link to="/register" className="text-primary">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
