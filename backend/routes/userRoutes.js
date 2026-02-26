const express = require("express");
const router = express.Router();
const { getNearbyUsers, updateLocation } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Nearby search route
router.get("/nearby", getNearbyUsers);

// Update location route
router.put("/location", protect, updateLocation);

module.exports = router;
