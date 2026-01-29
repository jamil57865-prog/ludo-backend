const express = require("express");
const router = express.Router();

/* ===== TEST AUTH ROUTE ===== */
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

/* ===== REGISTER ROUTE ===== */
router.post("/register", (req, res) => {
  // DEBUG (খুব দরকারি)
  console.log("HEADERS:", req.headers["content-type"]);
  console.log("BODY:", req.body);

  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      message: "Mobile & password required"
    });
  }

  // এখন শুধু test response
  res.json({
    success: true,
    message: "Register API working 🎉",
    data: {
      mobile
    }
  });
});

module.exports = router;
