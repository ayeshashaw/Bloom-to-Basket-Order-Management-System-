import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section'>
          <div className='footer-logo'>
            <h3>Bloom<span className='logo-star'>*to</span>Basket</h3>
            <p>Fresh from farm to your table. Supporting local farmers and sustainable agriculture.</p>
          </div>
        </div>
        
        <div className='footer-section'>
          <h4>Quick Links</h4>
          <ul>
            <li>About Us</li>
            <li>Our Farmers</li>
            <li>Products</li>
            <li>Testimonials</li>
            <li>Contact</li>
          </ul>
        </div>
        
        <div className='footer-section'>
          <h4>Categories</h4>
          <ul>
            <li>Vegetables</li>
            <li>Fruits</li>
            <li>Herbs</li>
            <li>Dairy</li>
            <li>Organic</li>
          </ul>
        </div>
        
        <div className='footer-section'>
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        
        <div className='footer-section'>
          <h4>Stay Connected</h4>
          <p>Subscribe to get updates on fresh produce and special offers.</p>
          <div className='newsletter'>
            <input type='email' placeholder='Enter your email' />
            <button>Subscribe</button>
          </div>
          <div className='social-links'>
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Twitter</span>
          </div>
        </div>
      </div>
      
      <div className='footer-bottom'>
        <p>&copy; 2024 Bloom to Basket. All rights reserved. | Made with ❤️ for sustainable farming</p>
      </div>
    </footer>
  )
}

export default Footer