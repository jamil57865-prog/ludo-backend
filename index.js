const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECT =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= USER MODEL =================
const UserSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

// ================= REGISTER API =================
app.post("/api/register", async (req, res) => {
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

    const newUser = new User({ mobile, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully ✅",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    message: "API Not Found",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
