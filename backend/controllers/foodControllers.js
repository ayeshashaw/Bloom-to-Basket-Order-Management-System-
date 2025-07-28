const fs = require("fs");
const foodModel = require("../models/foodModels");

const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }
    
    const image_filename = req.file.filename;
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity || 0,
      image: image_filename
    });
    
    await food.save();
    res.status(201).json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const listFoods = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.status(200).json({ success: true, data: food });
  } catch (error) {
    console.error("Error listing food:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }
    
    fs.unlink(`upload/${food.image}`, (err) => {
      if (err) {
        console.error("Image deletion error:", err.message);
      }
    });
    
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity
    };

    if (req.file) {
      const food = await foodModel.findById(id);
      if (food && food.image) {
        fs.unlink(`upload/${food.image}`, (err) => {
          if (err) {
            console.error("Old image deletion error:", err.message);
          }
        });
      }
      updateData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedFood) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, message: "Food updated successfully", data: updatedFood });
  } catch (error) {
    console.error("Error updating food:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    
    if (quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity cannot be negative" });
    }

    const food = await foodModel.findByIdAndUpdate(
      id, 
      { quantity }, 
      { new: true }
    );

    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, message: "Quantity updated successfully", data: food });
  } catch (error) {
    console.error("Error updating quantity:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodModel.findById(id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    res.json({ success: true, data: food });
  } catch (error) {
    console.error("Error getting food:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { 
  addFood, 
  listFoods, 
  deleteFood, 
  updateFood, 
  updateQuantity, 
  getFoodById 
};