import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBuses = async () => {
            if (!token) {
                setError('Please login to search buses');
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/buses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        Pragma: 'no-cache',
                    },
                });
                setBuses(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load buses. Please try again.');
                }
                console.error('Error fetching buses:', err);
                console.log('Error response:', err.response);
            }
        };
        fetchBuses();
    }, [token, navigate]);

    const handleBook = (busId) => {
        navigate(`/booking?busId=${busId}`);
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4">Available Buses</h2>
            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
            {buses.length === 0 && !error ? (
                <div className="alert alert-info text-center">No buses available at the moment.</div>
            ) : (
                <div className="row">
                    {buses.map((bus) => (
                        <div key={bus.id} className="col-md-6 mb-3">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {bus.fromLocation} to {bus.toLocation}
                                    </h5>
                                    <p className="card-text">
                                        Price: ${bus.price} | Available Seats: {bus.availableSeats}
                                    </p>
                                    <button
                                        onClick={() => handleBook(bus.id)}
                                        className="btn btn-primary"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusList;
