import React, { useState, useEffect, useContext } from 'react';
import './TrackOrders.css';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TrackOrders = () => {
  const { token, isAuthenticated } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
    
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://bloom-to-basket.onrender.com/api/order/userorders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrderId(orderId);
    
    try {
      const response = await fetch('https://bloom-to-basket.onrender.com/api/order/cancel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      });

      const result = await response.json();

      if (result.success) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        alert('Order cancelled successfully!');
      } else {
        alert(result.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleReorder = (order) => {
    const reorderItems = order.items.map(item => ({
      id: item.foodId,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    localStorage.setItem('reorderItems', JSON.stringify(reorderItems));
    
    navigate('/menu');
    
    alert('Previous order items have been added to your consideration. You can modify quantities and add more items.');
  };

  const handleTrackOrder = (orderId) => {
    alert(`Tracking details for Order #${orderId.slice(-8)} will be shown here.`);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return '#f39c12';
    if (status === 'confirmed') return '#3498db';
    if (status === 'preparing') return '#9b59b6';
    if (status === 'out for delivery') return '#e67e22';
    if (status === 'delivered') return '#27ae60';
    if (status === 'cancelled') return '#e74c3c';
    return '#95a5a6';
  };

  const getStatusIcon = (status) => {
    if (status === 'pending') return '⏳';
    if (status === 'confirmed') return '✅';
    if (status === 'preparing') return '👨‍🍳';
    if (status === 'out for delivery') return '🚚';
    if (status === 'delivered') return '📦';
    if (status === 'cancelled') return '❌';
    return '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your order is waiting for confirmation';
      case 'confirmed':
        return 'Your order has been confirmed';
      case 'preparing':
        return 'Your food is being prepared';
      case 'out for delivery':
        return 'Your order is on the way';
      case 'delivered':
        return 'Your order has been delivered';
      case 'cancelled':
        return 'This order was cancelled';
      default:
        return 'Order status unknown';
    }
  };

  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return (
      <div className="track-orders-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="track-orders-container">
      <div className="orders-header">
        <h2 className="orders-title">📦 My Orders</h2>
        <p className="orders-subtitle">Track and manage your food orders</p>
        <button onClick={handleRefresh} className="refresh-btn" disabled={loading}>
          {loading ? '🔄 Refreshing...' : '🔄 Refresh Orders'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">🍽️</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders. Start shopping for fresh food!</p>
          <button 
            onClick={() => navigate('/menu')} 
            className="start-shopping-btn"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3 className="order-id">Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">{formatDate(order.date)}</p>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  <span className="status-text">{order.status}</span>
                </div>
              </div>

              <div className="status-message">
                <p>{getStatusMessage(order.status)}</p>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">× {item.quantity}</span>
                    </div>
                    <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div className="delivery-info">
                  <h4>📍 Delivery Address</h4>
                  <p>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                  <p>📞 {order.address.phone}</p>
                </div>

                <div className="payment-info">
                  <h4>💳 Payment</h4>
                  <p>Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                  <p className="order-total">Total: ₹{order.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="order-actions">
                {order.status === 'pending' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancellingOrderId === order._id}
                  >
                    {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button 
                    className="reorder-btn"
                    onClick={() => handleReorder(order)}
                  >
                    Reorder
                  </button>
                )}
                <button 
                  className="track-btn"
                  onClick={() => handleTrackOrder(order._id)}
                >
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackOrders;
