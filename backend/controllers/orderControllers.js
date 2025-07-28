const foodModel = require("../models/foodModels");
const orderModel = require("../models/ordersModel");

const placeOrder = async (req, res) => {
  try {
    const { items, address, amount, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items in order"
      });
    }

    if (!address || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required order information"
      });
    }

    // Validate and update food quantities
    for (let item of items) {
      const food = await foodModel.findById(item.foodId);
      
      if (!food) {
        return res.status(400).json({
          success: false,
          message: `Food item ${item.name} not found`
        });
      }

      if (food.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${food.quantity}`
        });
      }

      // Reduce food quantity
      await foodModel.findByIdAndUpdate(
        item.foodId,
        { $inc: { quantity: -item.quantity } }
      );
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      paymentMethod,
      status: 'pending',
      payment: paymentMethod === 'online' ? true : false
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error("Place Order Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while placing order"
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 })
      .populate('items.foodId', 'name image');

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("Get User Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders"
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ date: -1 })
      .populate('userId', 'name email')
      .populate('items.foodId', 'name image');

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders"
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required"
      });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });

  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating order status"
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order. Order is already being processed."
      });
    }

    for (let item of order.items) {
      await foodModel.findByIdAndUpdate(
        item.foodId,
        { $inc: { quantity: item.quantity } }
      );
    }

    await orderModel.findByIdAndUpdate(orderId, { status: 'cancelled' });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {
    console.error("Cancel Order Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while cancelling order"
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await orderModel
      .findOne({ _id: orderId, userId })
      .populate('items.foodId', 'name image')
      .populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Get Order By ID Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching order"
    });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const pendingOrders = await orderModel.countDocuments({ status: 'pending' });
    const deliveredOrders = await orderModel.countDocuments({ status: 'delivered' });
    const cancelledOrders = await orderModel.countDocuments({ status: 'cancelled' });

    const totalRevenue = await orderModel.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error("Get Order Stats Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching order statistics"
    });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderById,
  getOrderStats
};