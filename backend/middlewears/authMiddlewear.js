const jwt = require("jsonwebtoken");
const userModel = require("../models/userModels");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token required" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: "Admin access required" 
    });
  }

  next();
};



module.exports = {
  authenticateToken,
  requireAdmin,
};
