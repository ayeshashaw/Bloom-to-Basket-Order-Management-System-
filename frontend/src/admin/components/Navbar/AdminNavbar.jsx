import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminNavbar.css'
import { AppContext } from '../../../context/AppContext';

const AdminNavbar= () => {
  const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useContext(AppContext);
  
    const handleLogout = () => {
      logout();
      navigate('/');
    };
  

  return (
    <nav className='navbar'>
      <div className='navbar-left'>
        <div className='logo'>
          Bloom<span className='logo-star'>*to</span>Basket
        </div>
      </div>

      <div className='navbar-right'>
        {isAuthenticated() ? (
          <>
            <span className='admin-text'>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className='login-btn'>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className='login-btn'>Login</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default AdminNavbar
