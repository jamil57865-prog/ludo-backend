const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ================= middleware =================
app.use(cors());
app.use(express.json());

// ================= MongoDB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("Mongo error ❌", err));

// ================= Test route =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= User Schema =================
const UserSchema = new mongoose.Schema(
  {
    name: String,
    mobile: { type: String, required: true, unique: true },
    email: String,
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// ================= REGISTER API =================
app.post("/api/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile & password required",
      });
    }

    const exists = await User.findOne({ mobile });
    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      mobile,
      email,
      password,
    });

    res.json({
      success: true,
      message: "User registered successfully 🎉",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// ================= 404 fallback =================
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

// ================= server =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
