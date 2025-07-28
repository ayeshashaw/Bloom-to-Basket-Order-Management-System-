const express = require("express");
const { authenticateToken, requireAdmin } = require("../middlewears/authMiddlewear");
const { placeOrder, getOrderById, cancelOrder, getAllOrders, updateOrderStatus, getOrderStats, getUserOrders } = require("../controllers/orderControllers");


const orderRouter = express.Router();

orderRouter.post("/place", authenticateToken, placeOrder);
orderRouter.get("/userorders", authenticateToken, getUserOrders); 
orderRouter.get("/:orderId", authenticateToken, getOrderById);
orderRouter.put("/cancel", authenticateToken, cancelOrder);

orderRouter.get("/admin/list", authenticateToken, requireAdmin, getAllOrders);
orderRouter.put("/admin/status", authenticateToken, requireAdmin, updateOrderStatus);
orderRouter.get("/admin/stats", authenticateToken, requireAdmin, getOrderStats);

module.exports = orderRouter;