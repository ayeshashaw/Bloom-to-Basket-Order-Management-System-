import React, { useState, useEffect, useContext } from 'react';
import './Menu.css';
import { AppContext } from '../../context/AppContext';

const UserItemsList = () => {
  const { user, isAuthenticated, addToCart, updateCartQuantity, getCartQuantity } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    'All', 'Fruits', 'Vegetables', 'Grains', 'Dairy', 'Meat', 'Seafood', 'Herbs', 'Beverages'
  ];

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    filterAndSortFoods();
  }, [foods, searchTerm, selectedCategory, sortBy]);

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

  const filterAndSortFoods = () => {
    let filtered = foods.filter(item => item.quantity > 0); // Only show items in stock

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredFoods(filtered);
  };

  const handleAddToCart = async (itemId) => {
    if (!isAuthenticated()) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart(itemId, 1);
      alert('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await updateCartQuantity(itemId, 0);
      } else {
        await updateCartQuantity(itemId, quantity);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      alert('Failed to update cart');
    }
  };

  const getTotalCartItems = () => {
    if (!isAuthenticated()) return 0;
    
    let total = 0;
    foods.forEach(item => {
      const quantity = getCartQuantity(item._id);
      total += quantity;
    });
    return total;
  };

  const getTotalCartValue = () => {
    if (!isAuthenticated()) return 0;
    
    let total = 0;
    foods.forEach(item => {
      const quantity = getCartQuantity(item._id);
      total += item.price * quantity;
    });
    return total;
  };

  if (loading) {
    return <div className="loading">Loading items...</div>;
  }

  return (
    <div className="user-items-container">
      <div className="items-header">
        <h2 className="items-title">Fresh Food Market</h2>
        {isAuthenticated() && (
          <div className="cart-info">
            <span className="cart-items">Cart: {getTotalCartItems()} items</span>
            <span className="cart-total">Total: ₹{getTotalCartValue().toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for fresh foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        <p>Showing {filteredFoods.length} items</p>
      </div>

      {filteredFoods.length === 0 ? (
        <div className="no-items">
          <p>No items found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredFoods.map((item) => {
            const cartQuantity = getCartQuantity(item._id);
            
            return (
              <div key={item._id} className="item-card">
                <div className="item-image">
                  <img 
                    src={`http://localhost:3000/images/${item.image}`} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-food.jpg';
                    }}
                  />
                  {item.quantity < 10 && (
                    <div className="low-stock-badge">Low Stock</div>
                  )}
                </div>
                
                <div className="item-content">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-category">{item.category}</span>
                  <p className="item-description">{item.description}</p>
                  
                  <div className="item-details">
                    <div className="item-price">₹{item.price}</div>
                    <div className="item-stock">Stock: {item.quantity}</div>
                  </div>

                  {isAuthenticated() ? (
                    <div className="cart-controls">
                      {cartQuantity === 0 ? (
                        <button 
                          onClick={() => handleAddToCart(item._id)}
                          className="add-to-cart-btn"
                          disabled={item.quantity === 0}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, cartQuantity - 1)}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity-display">{cartQuantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, cartQuantity + 1)}
                            className="quantity-btn"
                            disabled={cartQuantity >= item.quantity}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="login-prompt">
                      <p>Login to add to cart</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserItemsList;
