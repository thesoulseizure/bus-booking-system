import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
    const [passengers, setPassengers] = useState([{ name: '', age: '', seatNumber: '' }]);
    const [error, setError] = useState('');
    const [bus, setBus] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const busId = new URLSearchParams(location.search).get('busId');
    console.log('Bus ID from URL:', busId);

    useEffect(() => {
        const fetchBus = async () => {
            if (!token) {
                setError('Please login to book a ticket');
                navigate('/login');
                return;
            }
            if (!busId) {
                setError('No bus ID provided. Please select a bus.');
                return;
            }
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/buses/${busId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        Pragma: 'no-cache',
                    },
                });
                setBus(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else if (err.response?.status === 404) {
                    setError('Bus not found. Please select a different bus.');
                } else {
                    setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load bus details.');
                }
                console.error('Error fetching bus:', err);
                console.log('Error response:', err.response);
            }
        };
        fetchBus();
    }, [token, busId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('Please login to book a ticket');
            navigate('/login');
            return;
        }
        if (!busId) {
            setError('No bus ID provided. Please select a bus.');
            return;
        }
        if (!bus) {
            setError('Bus details not loaded. Please try again.');
            return;
        }

        // Validate passenger fields
        const seatNumbers = new Set();
        for (const p of passengers) {
            if (!p.name || !p.age || !p.seatNumber) {
                setError('Please fill all fields for all passengers');
                return;
            }
            if (seatNumbers.has(p.seatNumber)) {
                setError(`Seat number ${p.seatNumber} is already selected`);
                return;
            }
            // Validate age
            const age = parseInt(p.age);
            if (isNaN(age) || age < 1 || age > 120) {
                setError(`Invalid age for passenger: ${p.age}. Must be between 1 and 120.`);
                return;
            }
            // Validate seat number (assuming format like "A1", extract number for validation)
            const seatNumMatch = p.seatNumber.match(/\d+/);
            if (!seatNumMatch) {
                setError(`Invalid seat number format for ${p.seatNumber}. Include a number (e.g., A1).`);
                return;
            }
            const seatNum = parseInt(seatNumMatch[0]);
            if (isNaN(seatNum) || seatNum < 1 || seatNum > bus.availableSeats) {
                setError(`Seat number ${p.seatNumber} is invalid. Must be between 1 and ${bus.availableSeats}.`);
                return;
            }
            seatNumbers.add(p.seatNumber);
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/bookings`,
                { busId: parseInt(busId), passengers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        Pragma: 'no-cache',
                    },
                }
            );
            console.log('Booking response:', response.data);
            alert('Booking successful!');
            navigate('/profile');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Booking failed');
            }
            console.error('Booking error:', err);
            console.log('Error response:', err.response);
        }
    };

    const handleAddPassenger = () => {
        setPassengers([...passengers, { name: '', age: '', seatNumber: '' }]);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPassengers = [...passengers];
        updatedPassengers[index][name] = value;
        setPassengers(updatedPassengers);
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <h2 className="card-title text-center mb-4">Book Your Ticket</h2>
                            {bus && (
                                <div className="alert alert-info text-center mb-4">
                                    Route: {bus.fromLocation} to {bus.toLocation}, Available Seats: {bus.availableSeats}
                                </div>
                            )}
                            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                            {passengers.map((passenger, index) => (
                                <div key={index} className="border p-3 mb-3 rounded bg-light">
                                    <h5 className="mb-3">Passenger {index + 1}</h5>
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor={`name-${index}`} className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`name-${index}`}
                                                name="name"
                                                placeholder="Enter name"
                                                value={passenger.name}
                                                onChange={(e) => handleChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor={`age-${index}`} className="form-label">Age</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`age-${index}`}
                                                name="age"
                                                placeholder="Enter age"
                                                value={passenger.age}
                                                onChange={(e) => handleChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor={`seatNumber-${index}`} className="form-label">Seat Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id={`seatNumber-${index}`}
                                                name="seatNumber"
                                                placeholder="e.g., A1"
                                                value={passenger.seatNumber}
                                                onChange={(e) => handleChange(index, e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between">
                                <button onClick={handleAddPassenger} className="btn btn-outline-primary">Add Passenger</button>
                                <button onClick={handleSubmit} className="btn btn-primary">Book Ticket</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
