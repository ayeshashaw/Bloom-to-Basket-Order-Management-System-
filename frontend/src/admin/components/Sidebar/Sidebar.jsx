import React from 'react'
import './Sidebar.css'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <div onClick={() => navigate('/admin/add-items')} className="sidebar-item">Add Items</div>
        <div onClick={() => navigate('/admin/items')} className="sidebar-item">List Items</div>
        <div onClick={() => navigate('/admin/orders')} className="sidebar-item">Orders</div>
      </div>
    </div>
  )
}

export default Sidebar