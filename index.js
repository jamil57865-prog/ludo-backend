const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));

// ✅ AUTH ROUTES (THIS IS THE KEY LINE)
app.use("/api", require("./auth"));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ❌ Always keep this LAST
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
