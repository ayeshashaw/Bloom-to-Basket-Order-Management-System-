const express = require("express");
const { registerUser, loginUser, getUserProfile, getAllUsers } = require("../controllers/authControllers");
const { authenticateToken, requireAdmin } = require("../middlewears/authMiddlewear");


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authenticateToken, getUserProfile);
userRouter.get('/users', authenticateToken, requireAdmin, getAllUsers);



module.exports = userRouter;