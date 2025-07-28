const validate = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");
require('dotenv').config();


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }
    
    if (!validate.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Enter a strong password (min. 6 characters)",
      });
    }
    
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid role. Must be 'user' or 'admin'" 
      });
    }
    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    
    const newUser = new userModel({ 
      name, 
      email, 
      password: hashPassword,
      role: role || 'user'
    });
    
    const user = await newUser.save();
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );
    
    res.status(201).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );
    
    res.status(200).json({ 
      success: true, 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cartData: user.cartData
      }
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password');
    
    res.status(200).json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Get All Users Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getAllUsers 
};