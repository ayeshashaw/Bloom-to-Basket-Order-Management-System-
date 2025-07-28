import React, { useState, useEffect, useContext } from 'react';
import './ItemsList.css';
import { AppContext } from '../../context/AppContext';

const ItemsList = () => {
  const { token } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const categories = [
    'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Seafood', 'Herbs', 'Beverages'
  ];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch('https://bloom-to-basket.onrender.com/api/food/list');
      const result = await response.json();
      
      if (result.success) {
        setFoods(result.data);
      } else {
        alert('Failed to fetch food items');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch('https://bloom-to-basket.onrender.com/api/food/remove-food', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Item deleted successfully!');
          fetchFoods();
        } else {
          alert(result.message || 'Failed to delete item');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setEditFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      quantity: item.quantity
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      const response = await fetch(`https://bloom-to-basket.onrender.com/api/food/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Item updated successfully!');
        setEditingItem(null);
        fetchFoods();
      } else {
        alert(result.message || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update item');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="items-list-container">
      <div className="items-header">
        <h2 className="items-title">Food Items List</h2>
        <p className="items-count">Total Items: {foods.length}</p>
      </div>

      {foods.length === 0 ? (
        <div className="no-items">
          <p>No food items found. Add some items to get started!</p>
        </div>
      ) : (
        <div className="items-grid">
          {foods.map((item) => (
            <div key={item._id} className="item-card">
              <div className="item-image">
                <img 
                  src={`https://bloom-to-basket.onrender.com/images/${item.image}`} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-food.jpg';
                  }}
                />
              </div>
              
              <div className="item-content">
                {editingItem === item._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className="edit-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      className="edit-textarea"
                      rows="3"
                    />
                    <div className="edit-row">
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        className="edit-input-small"
                        step="0.01"
                      />
                      <input
                        type="number"
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleEditChange}
                        className="edit-input-small"
                      />
                    </div>
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleEditSubmit(item._id)}
                        className="save-btn"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingItem(null)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-category">{item.category}</span>
                    <p className="item-description">{item.description}</p>
                    
                    <div className="item-details">
                      <div className="item-price">₹{item.price}</div>
                      <div className="item-quantity">Stock: {item.quantity}</div>
                    </div>
                    
                    <div className="item-actions">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
