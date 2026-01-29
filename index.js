const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./auth");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔥 IMPORTANT: auth routes mount
app.use("/api", authRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
