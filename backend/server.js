const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const foodRouter = require("./routers/foodRoute");
const userRouter = require("./routers/userRouters");
const orderRouter = require("./routers/orderRoute");
require("dotenv").config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

connectDB();

app.use("/api/food", foodRouter);
app.use("/images", express.static("upload"));
app.use("/api/auth", userRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
