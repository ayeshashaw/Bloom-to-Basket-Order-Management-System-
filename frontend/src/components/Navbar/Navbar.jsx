import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { AppContext } from '../../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, cart, getTotalCartItems } = useContext(AppContext);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = getTotalCartItems ? getTotalCartItems() : 0;

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <div className='logo'>
          Bloom<span className='logo-star'>*to</span>Basket
        </div>
      </div>
      
      <div className='navbar-center'>
        <ul className='navbar-menu'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          {isAuthenticated() && (
            <li><Link to="/orders" className="orders-link">📦 My Orders</Link></li>
          )}
        </ul>
      </div>
      
      <div className='navbar-right'>
        {isAuthenticated() ? (
          <>
            <div className="cart-icon-container" onClick={() => navigate('/cart')}>
              <span className="cart-emoji">🛒</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
            <span className='admin-text'>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className='login-btn'>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/register')} className='register-btn'>Register</button>
            <button onClick={() => navigate('/login')} className='login-btn'>Login</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;