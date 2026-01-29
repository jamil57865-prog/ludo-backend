const express = require("express");
const router = express.Router();

// test
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

// REGISTER
router.post("/register", (req, res) => {
  console.log("BODY 👉", req.body); // 👈 এটা Render log এ দেখবে

  const { mobile, password } = req.body || {};

  if (!mobile || !password) {
    return res.status(400).json({
      message: "Mobile & password required"
    });
  }

  res.json({
    success: true,
    message: "Register API working 🎉",
    data: { mobile }
  });
});

module.exports = router;
