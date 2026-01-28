const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());

/* =====================
   MONGODB CONNECT
===================== */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* =====================
   ROOT + HEALTH
===================== */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: Date.now() });
});

/* =====================
   USER SCHEMA
===================== */
const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobile: { type: String, unique: true },
    email: String,
    password: String,
    balance: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

/* =====================
   REGISTER
===================== */
app.post("/api/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile & password required" });
    }

    const exists = await User.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      mobile,
      email,
      password
    });

    await user.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   LOGIN
===================== */
app.post("/api/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        balance: user.balance,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   ADD BALANCE
===================== */
app.post("/api/deposit", async (req, res) => {
  try {
    const { mobile, amount } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += Number(amount);
    await user.save();

    res.json({ message: "Balance added", balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =====================
   ADMIN LOGIN
===================== */
app.post("/api/admin/login", async (req, res) => {
  const { mobile, password } = req.body;

  const admin = await User.findOne({
    mobile,
    password,
    isAdmin: true
  });

  if (!admin) {
    return res.status(401).json({ message: "Admin login failed" });
  }

  res.json({ message: "Admin login successful" });
});

/* =====================
   ADMIN → ALL USERS
===================== */
app.get("/api/admin/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

/* =====================
   404 HANDLER
===================== */
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

/* =====================
   START SERVER
===================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
