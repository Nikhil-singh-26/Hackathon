const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


router.post("/signup", signup);
router.post("/login", login);


router.get("/me", protect, getMe);
router.post("/logout", protect, (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
