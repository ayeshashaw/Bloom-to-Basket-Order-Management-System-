import React, { useState, useEffect, useContext } from 'react';
import './PlaceOrder.css';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { 
    cart, 
    user, 
    token, 
    clearCart, 
    isAuthenticated 
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (Object.keys(cart).length === 0) {
      navigate('/menu');
      return;
    }
    
    fetchFoods();
  }, [isAuthenticated, cart, navigate]);

  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/food/list');
      const result = await response.json();
      
      if (result.success) {
        setFoods(result.data);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const getCartItems = () => {
    return Object.entries(cart).map(([itemId, quantity]) => {
      const item = foods.find(food => food._id === itemId);
      return item ? { ...item, cartQuantity: quantity } : null;
    }).filter(Boolean);
  };

  const getSubtotal = () => {
    return getCartItems().reduce((total, item) => 
      total + (item.price * item.cartQuantity), 0
    );
  };

  const getDeliveryFee = () => {
    return getSubtotal() > 500 ? 0 : 50;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: getCartItems().map(item => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.cartQuantity
        })),
        address: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zipCode: orderData.zipCode
        },
        amount: getTotalAmount(),
        paymentMethod: orderData.paymentMethod,
        status: 'pending'
      };

      const response = await fetch('http://localhost:3000/api/order/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  const cartItems = getCartItems();

  return (
    <div className="place-order-container">
      <div className="place-order-content">
        <div className="order-form-section">
          <h2 className="section-title">🚚 Delivery Information</h2>
          
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={orderData.firstName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={orderData.lastName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={orderData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter email address"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                name="address"
                value={orderData.address}
                onChange={handleInputChange}
                required
                className="form-textarea"
                placeholder="Enter full address"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  value={orderData.city}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter city"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  value={orderData.state}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter state"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={orderData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>

            <div className="payment-section">
              <h3 className="section-subtitle">💳 Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={orderData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">💵 Cash on Delivery</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={orderData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-label">💳 Online Payment</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="place-order-btn"
            >
              {loading ? 'Placing Order...' : `Place Order - ₹${getTotalAmount().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="order-summary-section">
          <h2 className="section-title">📋 Order Summary</h2>
          
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item._id} className="order-item">
                <img
                  src={`http://localhost:3000/images/${item.image}`}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.price} × {item.cartQuantity}</p>
                </div>
                <div className="order-item-total">
                  ₹{(item.price * item.cartQuantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{getSubtotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee:</span>
              <span>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}</span>
            </div>
            <div className="total-row final-total">
              <span><strong>Total:</strong></span>
              <span><strong>₹{getTotalAmount().toFixed(2)}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;