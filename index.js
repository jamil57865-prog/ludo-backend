// ===============================
// index.js (Ludo Backend)
// ===============================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(
    "mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/ludoDB?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===============================
// User Schema
// ===============================
const UserSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, unique: true },
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  role: { type: String, default: "user" }, // user / admin
});

const User = mongoose.model("User", UserSchema);

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Ludo backend running 🚀",
    time: Date.now(),
  });
});

// ===============================
// REGISTER API
// ===============================
app.post("/api/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      mobile,
      email,
      password: hashedPassword,
      balance: 0,
    });

    await user.save();

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: "User already exists" });
  }
});

// ===============================
// LOGIN API
// ===============================
app.post("/api/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "LUDO_SECRET_KEY",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        balance: user.balance,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
