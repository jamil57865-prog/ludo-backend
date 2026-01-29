const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// User Schema
const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("User", userSchema);

// ✅ TEST ROUTE (VERY IMPORTANT)
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

// ✅ REGISTER API
router.post("/register", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile & password required",
      });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      mobile,
      password,
    });

    await user.save();

    res.json({
      message: "User registered successfully ✅",
      user: {
        id: user._id,
        mobile: user.mobile,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
