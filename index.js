const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   🔐 CONFIG
========================= */
const JWT_SECRET = "USER_SECRET_123";
const ADMIN_SECRET = "ADMIN_SECRET_123";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

/* =========================
   🧠 MIDDLEWARE
========================= */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

/* =========================
   🗄️ DATABASE
========================= */
mongoose.connect(
    "YOUR_MONGODB_ATLAS_URL_HERE",
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

/* =========================
   👤 USER MODEL
========================= */
const UserSchema = new mongoose.Schema({
    name: String,
    mobile: { type: String, unique: true },
    email: String,
    password: String,
    balance: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

/* =========================
   🧾 USER REGISTER
========================= */
app.post("/api/register", async (req, res) => {
    try {
        const { name, mobile, password, email } = req.body;

        if (!name || !mobile || !password) {
            return res.json({ success: false, message: "Missing fields" });
        }

        const exists = await User.findOne({ mobile });
        if (exists) {
            return res.json({ success: false, message: "Mobile already registered" });
        }

        const user = await User.create({
            name,
            mobile,
            email,
            password,
            balance: 0
        });

        res.json({ success: true, user });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/* =========================
   🔑 USER LOGIN
========================= */
app.post("/api/login", async (req, res) => {
    try {
        const { mobile, password } = req.body;

        const user = await User.findOne({ mobile, password });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: "user" },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                balance: user.balance
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/* =========================
   🛡️ ADMIN LOGIN
========================= */
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Invalid admin credentials"
        });
    }

    const token = jwt.sign(
        { role: "admin", username },
        ADMIN_SECRET,
        { expiresIn: "12h" }
    );

    res.json({
        success: true,
        token
    });
});

/* =========================
   🧪 TEST ROUTE
========================= */
app.get("/", (req, res) => {
    res.send("Ludo Backend Running ✅");
});

/* =========================
   🚀 START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
