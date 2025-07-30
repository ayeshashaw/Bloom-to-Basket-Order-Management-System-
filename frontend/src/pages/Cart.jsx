import React, { useState, useEffect, useContext } from 'react';
import './Cart.css';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    getTotalCartItems, 
    isAuthenticated 
  } = useContext(AppContext);
  
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchFoods();
  }, [isAuthenticated, navigate]);

  const fetchFoods = async () => {
    try {
      const response = await fetch('https://bloom-to-basket.onrender.com/api/food/list');
      const result = await response.json();
      
      if (result.success) {
        setFoods(result.data);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
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
    const subtotal = getSubtotal();
    return subtotal > 500 ? 0 : 50; 
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleQuantityChange = (itemId, newQuantity, maxStock) => {
    if (newQuantity > maxStock) {
      alert('Cannot add more items than available stock');
      return;
    }
    updateCartQuantity(itemId, newQuantity);
  };

  const handleProceedToCheckout = () => {
    if (getCartItems().length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/place');
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  const cartItems = getCartItems();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">🛒 Your Shopping Cart</h2>
        <p className="cart-subtitle">
          {getTotalCartItems()} {getTotalCartItems() === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some fresh items to get started!</p>
          <button 
            onClick={() => navigate('/menu')} 
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <h3>Items in Cart</h3>
              <button 
                onClick={clearCart} 
                className="clear-cart-btn"
              >
                Clear All
              </button>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={`https://bloom-to-basket.onrender.com/images/${item.image}`} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-food.jpg';
                    }}
                  />
                </div>

                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">₹{item.price} each</p>
                  <p className="item-stock">Stock: {item.quantity}</p>
                </div>

                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.cartQuantity - 1, item.quantity)}
                    className="quantity-btn"
                    disabled={item.cartQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.cartQuantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.cartQuantity + 1, item.quantity)}
                    className="quantity-btn"
                    disabled={item.cartQuantity >= item.quantity}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="remove-btn"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({getTotalCartItems()} items)</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}</span>
              </div>
              
              {getDeliveryFee() > 0 && (
                <div className="delivery-notice">
                  <small>💡 Add ₹{(500 - getSubtotal()).toFixed(2)} more for free delivery!</small>
                </div>
              )}
              
              <hr className="summary-divider" />
              
              <div className="summary-row total-row">
                <span><strong>Total Amount</strong></span>
                <span><strong>₹{getTotalAmount().toFixed(2)}</strong></span>
              </div>
              
              <button 
                onClick={handleProceedToCheckout}
                className="checkout-btn"
              >
                Proceed to Checkout 🚀
              </button>
              
              <button 
                onClick={() => navigate('/menu')} 
                className="continue-shopping-link"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
