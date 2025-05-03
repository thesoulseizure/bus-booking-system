import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setError('Please login to view your profile');
                navigate('/login');
                return;
            }
            try {
                const userResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevent caching
                        Pragma: 'no-cache',
                    },
                });
                setUser(userResponse.data);
                setFormData({ name: userResponse.data.name, email: userResponse.data.email, password: '' });

                const bookingsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/history`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        Pragma: 'no-cache',
                    },
                });
                setBookings(bookingsResponse.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Session expired. Please login again.');
                    localStorage.removeItem('token'); // Clear invalid token
                    navigate('/login');
                } else {
                    setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load profile');
                }
                console.error('Profile error:', err);
                console.log('Error response:', err.response);
            }
        };
        fetchProfile();
    }, [token, navigate]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setError(''); // Clear any previous errors
        setFormData({ ...formData, password: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateRequest = {
                name: formData.name,
                email: formData.email,
                password: formData.password || null,
            };
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/users/profile`,
                updateRequest,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        Pragma: 'no-cache',
                    },
                }
            );
            setUser(response.data);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update profile');
            }
            console.error('Update error:', err);
            console.log('Error response:', err.response);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <h2 className="card-title text-center mb-4">User Profile</h2>
                            {error && <div className="alert alert-danger text-center" role="alert">{error}</div>}
                            {user && (
                                <>
                                    <div className="mb-4">
                                        <h5 className="mb-3">Profile Details</h5>
                                        {isEditing ? (
                                            <form onSubmit={handleUpdate}>
                                                <div className="mb-3">
                                                    <label htmlFor="name" className="form-label">Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
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
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="password" className="form-label">New Password (Optional)</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Enter new password"
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                                    <button type="button" onClick={handleEditToggle} className="btn btn-outline-secondary">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div>
                                                <p><strong>Name:</strong> {user.name}</p>
                                                <p><strong>Email:</strong> {user.email}</p>
                                                <button onClick={handleEditToggle} className="btn btn-outline-primary">Edit Profile</button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="mb-3">Booking History</h5>
                                        {bookings.length === 0 ? (
                                            <p>No bookings found.</p>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Booking ID</th>
                                                            <th>Bus Route</th>
                                                            <th>Booking Time</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bookings.map(booking => (
                                                            <tr key={booking.id}>
                                                                <td>{booking.id}</td>
                                                                <td>{booking.bus?.fromLocation} to {booking.bus?.toLocation}</td>
                                                                <td>{new Date(booking.bookingTime).toLocaleString()}</td>
                                                                <td>{booking.status}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
