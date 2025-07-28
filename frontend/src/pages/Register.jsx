import React, { useState, useContext } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Register = () => {
    const navigate = useNavigate()
    const { register, loading } = useContext(AppContext)
    
    const [formData, setFormData] = useState({
        accountType: 'farmer',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const userData = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: 'user'
        };

        const result = await register(userData);
        
        if (result.success) {
            alert('Account created successfully! Welcome to Bloom to Basket!');
            navigate('/');
        } else {
            alert(result.message);
        }
    };

    return (
        <>
            <div className="register-container">
                <div className="register-image-section">
                    <button className="back-to-home" onClick={() => navigate("/")}>
                        ← Back to Home
                    </button>
                    
                    <div className="welcome-content">
                        <span className="welcome-icon">🌱</span>
                        <h2 className="welcome-title">
                            Join Bloom<span style={{color: '#e67e22'}}>*</span>to<span style={{color: '#2c3e50'}}>Basket</span>
                        </h2>
                        <p className="welcome-subtitle">
                            Connect with local farmers, discover fresh produce, and be part of a sustainable food community that brings farm-fresh goodness directly to your table.
                        </p>
                    </div>
                </div>

                <div className="register-form-section">
                    <div className="register-form-container">
                        <h1 className="register-title">Create an Account</h1>
                        <p className="register-subtitle">Start your fresh food journey today</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email address"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Create a strong password"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your password"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="login-link-container">
                            <span className="login-link-text">
                                Already have an account?{' '}
                                <button
                                    className="login-link"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign in here
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;