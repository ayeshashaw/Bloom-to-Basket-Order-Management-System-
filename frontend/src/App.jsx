import React, { useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import {Routes, Route, Navigate, useLocation} from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import './App.css'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/Footer/Footer'
import AdminNavbar from './admin/components/Navbar/AdminNavbar'
import Sidebar from './admin/components/Sidebar/Sidebar'
import { AppContext } from './context/AppContext'
import OrderList from './admin/pages/OrderList'
import ItemsList from './admin/pages/ItemsList'
import AddItems from './admin/pages/AddItems'
import Menu from './components/Menu/Menu'
import Contact from './pages/Contact'
import TrackOrders from './pages/TrackOrders'

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useContext(AppContext)
  
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useContext(AppContext)
  
  if (isAuthenticated()) {
    if (isAdmin()) {
      return <Navigate to="/admin/orders" replace />
    }
    return <Navigate to="/" replace />
  }
  
  return children
}

const App = () => {
  const location = useLocation()
  
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  return (
    <div>
      {!isAdminRoute && <Navbar />}
      
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/menu' element={<Menu/>}/>
        
        <Route 
          path='/cart' 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/orders' 
          element={
            <ProtectedRoute>
              <TrackOrders/>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/place' 
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path='/register' 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        <Route 
          path='/login' 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        <Route 
          path='/admin/*' 
          element={
            <ProtectedRoute requireAdmin={true}>
              <div className="admin-layout">
                <AdminNavbar />
                <div className="admin-content">
                  <Sidebar />
                  <div className="admin-main">
                    <Routes>
                      <Route index element={<Navigate to="orders" replace />} />
                      <Route path="orders" element={<OrderList/>} />
                      <Route path="items" element={<ItemsList/>} />
                      <Route path="add-items" element={<AddItems/>} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App