const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      message: "Mobile & password required"
    });
  }

  return res.json({
    success: true,
    message: "Register API working 🎉",
    mobile
  });
});

// test auth
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

module.exports = router;
