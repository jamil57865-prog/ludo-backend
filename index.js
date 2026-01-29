const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json()); // 🔥 খুব গুরুত্বপূর্ণ

/* ================= MONGODB CONNECT ================= */
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* ================= USER SCHEMA ================= */
const userSchema = new mongoose.Schema(
  {
    name: String,
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* ================= ROUTES ================= */

// ✅ Root check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Register API
app.post("/api/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile & password required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Save user
    const newUser = new User({
      name,
      mobile,
      email,
      password, // এখন plain রাখছি (পরের ধাপে hash করব)
    });

    await newUser.save();

    res.json({
      success: true,
      message: "User registered successfully 🎉",
      user: {
        id: newUser._id,
        name: newUser.name,
        mobile: newUser.mobile,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ❌ Unknown API handler
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
