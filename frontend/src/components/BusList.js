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
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBuses(response.data);
            } catch (err) {
                console.error('Error fetching buses:', err);
                setError('Failed to load buses. Please try again.');
            }
        };
        fetchBuses();
    }, [token, navigate]);

    const handleBook = (busId) => {
        navigate(`/booking?busId=${busId}`);
    };

    return (
        <div>
            <h1>Available Buses</h1>
            {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '10px' }}>{error}</div>}
            {buses.map(bus => (
                <div key={bus.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                    <p>From: {bus.fromLocation}, To: {bus.toLocation}, Price: ${bus.price}, Available Seats: {bus.availableSeats}</p>
                    <button onClick={() => handleBook(bus.id)}>Book</button>
                </div>
            ))}
        </div>
    );
};

export default BusList;
