const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth");

const app = express();

/* ✅ MUST */
app.use(cors());
app.use(express.json()); // 🔥 এই লাইনটাই মিস ছিল

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// auth routes
app.use("/api", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
