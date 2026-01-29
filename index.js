const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("Mongo error ❌", err));

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ AUTH ROUTES (এই লাইনটাই আগে ছিল না / ভুল ছিল)
const authRoutes = require("./auth");
app.use("/api", authRoutes);

// ❌ 404 handler (সবশেষে থাকবে)
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
