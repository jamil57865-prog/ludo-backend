const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./auth");

const app = express();

/* ===== MIDDLEWARE (সবচেয়ে গুরুত্বপূর্ণ) ===== */
app.use(cors());
app.use(express.json()); // JSON body পড়ার জন্য
app.use(express.urlencoded({ extended: true })); // form / raw body পড়ার জন্য

/* ===== DATABASE CONNECT ===== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("MongoDB error ❌", err));

/* ===== TEST ROOT ===== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ===== ROUTES ===== */
app.use("/api", authRoutes);

/* ===== NOT FOUND HANDLER ===== */
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
