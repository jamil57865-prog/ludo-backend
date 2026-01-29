const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const router = express.Router();

/* =========================
   User Schema
========================= */
const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* =========================
   REGISTER API
   POST /api/register
========================= */
router.post("/register", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile & password required"
      });
    }

    // Check user exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      mobile,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully ✅",
      user: {
        id: newUser._id,
        mobile: newUser.mobile,
        balance: newUser.balance
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
