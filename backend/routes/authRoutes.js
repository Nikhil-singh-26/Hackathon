const express = require("express");
const router = express.Router();
const { signup, login, getMe, forgotPassword, resetPassword, googleLogin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);


router.get("/me", protect, getMe);
router.post("/logout", protect, (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
