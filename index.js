const express = require("express");
const cors = require("cors");

const authRoutes = require("./auth");

const app = express();

// 🔥 এই দুইটা না থাকলেই req.body = {}
app.use(cors());
app.use(express.json()); // ⭐ সবচেয়ে গুরুত্বপূর্ণ
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// auth routes
app.use("/api", authRoutes);

// fallback
app.use((req, res) => {
  res.status(404).json({ message: "API Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
