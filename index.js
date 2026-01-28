const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// ✅ ROOT ROUTE (এইটা না থাকায় Not Found দেখাচ্ছিল)
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Ludo backend running 🚀",
    time: Date.now(),
  });
});

// ✅ health check (optional but good)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: Date.now(),
  });
});

// example API
app.post("/api/test", (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
