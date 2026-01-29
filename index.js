const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./auth");   // 🔥 এটা খুব জরুরি

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 🔥 এখানেই সমস্যা ছিল
app.use("/api", authRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
