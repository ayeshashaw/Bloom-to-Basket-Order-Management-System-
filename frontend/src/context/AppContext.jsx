import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AppContext = createContext(null)

const AppContextProvider = ({children}) => {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState({})

    const API_URL = 'https://bloom-to-basket.onrender.com/api/auth'

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        const savedCart = localStorage.getItem('cart')
        
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const register = async (userData) => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/register`, userData)
            
            if (response.data.success) {
                const { token, user } = response.data
                
                setToken(token)
                setUser(user)
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                
                return { success: true, message: 'Registration successful!' }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed'
            return { success: false, message: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/login`, credentials)
            
            if (response.data.success) {
                const { token, user } = response.data
                
                setToken(token)
                setUser(user)
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                
                return { success: true, message: 'Login successful!' }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed'
            return { success: false, message: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        setCart({})
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('cart')
    }

    const getUserProfile = async () => {
        if (!token) return { success: false, message: 'No token found' }
        
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (response.data.success) {
                setUser(response.data.user)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                return { success: true, user: response.data.user }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to get profile'
            return { success: false, message: errorMessage }
        }
    }

    
    const getAllUsers = async () => {
        if (!token || user?.role !== 'admin') {
            return { success: false, message: 'Admin access required' }
        }
        
        try {
            const response = await axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            if (response.data.success) {
                return { success: true, users: response.data.users }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to get users'
            return { success: false, message: errorMessage }
        }
    }

    const addToCart = (itemId, quantity = 1) => {
        setCart(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + quantity
        }))
    }

    const removeFromCart = (itemId) => {
        setCart(prev => {
            const newCart = { ...prev }
            delete newCart[itemId]
            return newCart
        })
    }

    const updateCartQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId)
        } else {
            setCart(prev => ({
                ...prev,
                [itemId]: quantity
            }))
        }
    }

    const getCartQuantity = (itemId) => {
        return cart[itemId] || 0
    }

    const getTotalCartItems = () => {
        return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
    }

    const getTotalCartValue = (foods = []) => {
        return Object.entries(cart).reduce((total, [itemId, quantity]) => {
            const item = foods.find(food => food._id === itemId)
            return total + (item ? item.price * quantity : 0)
        }, 0)
    }

    const clearCart = () => {
        setCart({})
    }

    const isAuthenticated = () => {
        return !!token && !!user
    }

    const isAdmin = () => {
        return user?.role === 'admin'
    }

    const contextValue = {
        token,
        user,
        loading,
        cart,
        register,
        login,
        logout,
        getUserProfile,
        getAllUsers,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartQuantity,
        getTotalCartItems,
        getTotalCartValue,
        clearCart,
        isAuthenticated,
        isAdmin
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
