import React, { useState, useContext } from 'react';
import './AddItems.css';
import { AppContext } from '../../context/AppContext';

const AddItems = () => {
  const { token } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: ''
  });

  const categories = [
    'Fruits',
    'Vegetables',
    'Grains',
    'Dairy',
    'Meat',
    'Seafood',
    'Herbs',
    'Beverages'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      alert('Please select an image');
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('image', image);

    try {
      const response = await fetch('http://localhost:3000/api/food/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        alert('Food item added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          quantity: ''
        });
        setImage(null);
        document.getElementById('image-input').value = '';
      } else {
        alert(result.message || 'Failed to add food item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add food item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-items-container">
      <div className="add-items-card">
        <h2 className="add-items-title">Add New Food Item</h2>
        
        <form onSubmit={handleSubmit} className="add-items-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Select category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              required
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="form-file-input"
            />
            {image && (
              <div className="image-preview">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItems;