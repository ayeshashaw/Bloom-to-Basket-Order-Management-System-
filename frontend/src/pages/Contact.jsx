import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">📞 Contact Us</h1>
        <p className="contact-subtitle">
          We'd love to hear from you! Get in touch with us.
        </p>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <div className="contact-info">
          <h2 className="info-title">Get in Touch</h2>
          
          <div className="info-item">
            <div className="info-icon">📍</div>
            <div className="info-details">
              <h4>Address</h4>
              <p>
                123 Food Street, Kolkata<br />
                West Bengal, India - 700001
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📞</div>
            <div className="info-details">
              <h4>Phone</h4>
              <p>
                +91 98765 43210<br />
                +91 87654 32109
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">✉️</div>
            <div className="info-details">
              <h4>Email</h4>
              <p>
                info@fooddelivery.com<br />
                support@fooddelivery.com
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">⏰</div>
            <div className="info-details">
              <h4>Hours</h4>
              <p>
                Mon - Fri: 9 AM - 11 PM<br />
                Sat - Sun: 10 AM - 12 AM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2 className="form-title">Send Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                rows="6"
              />
            </div>

            <button type="submit" className="submit-btn">
              📤 Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Quick Info */}
      <div className="quick-info">
        <h3>Quick Questions?</h3>
        <p>For immediate assistance, call us or check our FAQ section</p>
        <div className="info-tags">
          <span className="info-tag">🍕 Order Issues</span>
          <span className="info-tag">🚚 Delivery Questions</span>
          <span className="info-tag">💳 Payment Help</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;