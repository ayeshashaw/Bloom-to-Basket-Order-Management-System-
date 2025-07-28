import React, { useState, useContext } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate()
  const { login, loading } = useContext(AppContext)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    if (!formData.email || !formData.password) {
      alert('Please fill in all fields!');
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      alert('Login successful! Welcome back to Bloom to Basket!');
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
              Welcome Back to Bloom<span style={{color: '#e67e22'}}>*</span>to<span style={{color: '#2c3e50'}}>Basket</span>
            </h2>
            <p className="welcome-subtitle">
              Sign in to continue your fresh food journey and connect with local farmers in your community.
            </p>
          </div>
        </div>
        <div className="register-form-section">
          <div className="register-form-container">
            <h1 className="register-title">Sign In</h1>
            <p className="register-subtitle">Welcome back! Please sign in to your account</p>
            
            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  required
                  className="form-input"
                />
              </div>
              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div className="login-link-container">
              <span className="login-link-text">
                Don't have an account?{' '}
                <button
                  className="login-link"
                  onClick={() => navigate('/register')}
                >
                  Register here
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;