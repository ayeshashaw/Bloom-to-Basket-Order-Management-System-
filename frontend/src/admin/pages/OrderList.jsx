import React, { useState, useEffect, useContext } from 'react';
import './OrderList.css';
import { AppContext } from '../../context/AppContext';

const OrderList = () => {
  const { token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'out for delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://bloom-to-basket.onrender.com/api/order/admin/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      } else {
        alert('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('https://bloom-to-basket.onrender.com/api/order/admin/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      const result = await response.json();

      if (result.success) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        alert('Order status updated successfully');
      } else {
        alert(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'preparing': return '#9b59b6';
      case 'out for delivery': return '#e67e22';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const customerName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase();
        const orderId = order._id.toLowerCase();
        const phone = order.address.phone.toLowerCase();
        const itemsText = order.items.map(item => item.name.toLowerCase()).join(' ');
        
        return customerName.includes(searchLower) ||
               orderId.includes(searchLower) ||
               phone.includes(searchLower) ||
               itemsText.includes(searchLower);
      });
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null;
        
        if (startDate && orderDate < startDate) return false;
        if (endDate && orderDate > endDate) return false;
        return true;
      });
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const exportToCSV = () => {
    const filteredOrders = getFilteredOrders();
    
    if (filteredOrders.length === 0) {
      alert('No orders to export');
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Phone',
      'Email',
      'Address',
      'Items',
      'Total Amount',
      'Status',
      'Order Date',
      'Payment Method'
    ];

    const csvData = filteredOrders.map(order => [
      order._id,
      `${order.address.firstName} ${order.address.lastName}`,
      order.address.phone,
      order.address.email || '',
      `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipcode}`,
      order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
      order.amount.toFixed(2),
      order.status,
      formatDate(order.date),
      order.payment ? 'Online' : 'Cash on Delivery'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setFilterStatus('all');
    setSearchTerm('');
    setDateRange({ start: '', end: '' });
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h2 className="order-list-title">📋 Order Management</h2>
        <div className="header-actions">
          <button onClick={exportToCSV} className="export-btn">
            📊 Export CSV
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Search Orders:</label>
            <input
              type="text"
              placeholder="Search by customer name, phone, order ID, or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>From Date:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="date-input"
            />
          </div>
          
          <div className="filter-group">
            <label>To Date:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <button onClick={clearFilters} className="clear-filters-btn">
              🗑️ Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="order-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{filteredOrders.length}</span>
          <span className="stat-label">Filtered Results</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.status === 'pending').length}
          </span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {orders.filter(o => o.status === 'delivered').length}
          </span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            ₹{orders
              .filter(o => o.status === 'delivered')
              .reduce((sum, o) => sum + o.amount, 0)
              .toFixed(2)}
          </span>
          <span className="stat-label">Revenue</span>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found for the current filters.</p>
          {(searchTerm || filterStatus !== 'all' || dateRange.start || dateRange.end) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <div className="header-cell">Order ID</div>
            <div className="header-cell">Customer</div>
            <div className="header-cell">Items</div>
            <div className="header-cell">Amount</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Date</div>
            <div className="header-cell">Actions</div>
          </div>

          {filteredOrders.map((order) => (
            <div key={order._id} className="table-row">
              <div className="table-cell order-id">
                #{order._id.slice(-8)}
              </div>
              
              <div className="table-cell customer-info">
                <div className="customer-name">
                  {order.address.firstName} {order.address.lastName}
                </div>
                <div className="customer-contact">
                  {order.address.phone}
                </div>
              </div>

              <div className="table-cell order-items">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="item-summary">
                    {item.name} × {item.quantity}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="more-items">
                    +{order.items.length - 2} more
                  </div>
                )}
              </div>

              <div className="table-cell order-amount">
                ₹{order.amount.toFixed(2)}
              </div>

              <div className="table-cell order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>

              <div className="table-cell order-date">
                {formatDate(order.date)}
              </div>

              <div className="table-cell order-actions">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="status-select"
                  disabled={order.status === 'delivered' || order.status === 'cancelled'}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
