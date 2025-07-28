const express = require("express");
const multer = require("multer");
const { authenticateToken, requireAdmin } = require("../middlewears/authMiddlewear");
const { listFoods, getFoodById, updateFood, deleteFood, addFood } = require("../controllers/foodControllers");


const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "upload",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

foodRouter.post("/add", authenticateToken, requireAdmin, upload.single("image"), addFood);
foodRouter.get("/list", listFoods);
foodRouter.get("/:id", getFoodById);
foodRouter.put("/:id", authenticateToken, requireAdmin, upload.single("image"), updateFood);
foodRouter.put("/quantity", authenticateToken, requireAdmin, updateFood);
foodRouter.post("/remove-food", authenticateToken, requireAdmin, deleteFood);

module.exports = foodRouter;