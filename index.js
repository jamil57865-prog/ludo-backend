// ===============================
// LUDO BACKEND - BASIC API
// ===============================

const express = require("express");
const cors = require("cors");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors()); // allow all origins (frontend connect)
app.use(express.json()); // parse JSON body

// ---------- TEMP DATABASE (Memory) ----------
const users = [];

// ---------- ROOT CHECK ----------
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Ludo backend running",
        time: Date.now()
    });
});

// ===============================
// REGISTER API
// ===============================
app.post("/api/register", (req, res) => {
    const { name, mobile, password, email } = req.body;

    if (!name || !mobile || !password) {
        return res.json({
            success: false,
            message: "Missing required fields"
        });
    }

    // check if user exists
    const exists = users.find(u => u.mobile === mobile);
    if (exists) {
        return res.json({
            success: false,
            message: "User already registered"
        });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        mobile,
        email: email || "",
        password, // ⚠️ plain text (hash later)
        balance: 5000,
        createdAt: new Date()
    };

    users.push(newUser);

    console.log("✅ REGISTER:", mobile);

    res.json({
        success: true,
        message: "Registration successful",
        user: {
            id: newUser.id,
            name: newUser.name,
            mobile: newUser.mobile,
            email: newUser.email,
            balance: newUser.balance
        }
    });
});

// ===============================
// LOGIN API
// ===============================
app.post("/api/login", (req, res) => {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
        return res.json({
            success: false,
            message: "Missing mobile or password"
        });
    }

    const user = users.find(
        u => u.mobile === mobile && u.password === password
    );

    if (!user) {
        return res.json({
            success: false,
            message: "Invalid mobile or password"
        });
    }

    console.log("✅ LOGIN:", mobile);

    res.json({
        success: true,
        message: "Login successful",
        user: {
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            balance: user.balance
        }
    });
});

// ===============================
// WALLET API
// ===============================
app.get("/api/wallet/:mobile", (req, res) => {
    const { mobile } = req.params;

    const user = users.find(u => u.mobile === mobile);
    if (!user) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    res.json({
        success: true,
        balance: user.balance
    });
});

// ===============================
// BET API
// ===============================
app.post("/api/bet", (req, res) => {
    const { mobile, amount } = req.body;

    const user = users.find(u => u.mobile === mobile);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    if (user.balance < amount) {
        return res.json({ success: false, message: "Insufficient balance" });
    }

    user.balance -= amount;

    res.json({
        success: true,
        message: "Bet placed",
        balance: user.balance
    });
});

// ===============================
// WIN API
// ===============================
app.post("/api/win", (req, res) => {
    const { mobile, amount } = req.body;

    const user = users.find(u => u.mobile === mobile);
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    user.balance += amount * 2;

    res.json({
        success: true,
        message: "Win added",
        balance: user.balance
    });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Ludo backend running on port", PORT);
});
