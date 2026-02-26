const express = require("express");
const router = express.Router();
const { getNearbyUsers, updateVendorProfile, getVendors } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Organizer routes
router.get("/nearby", protect, authorizeRoles("organizer", "admin"), getNearbyUsers);
router.get("/vendors", protect, authorizeRoles("organizer", "admin"), getVendors);

// Vendor routes
router.patch("/update-profile", protect, authorizeRoles("vendor", "admin"), updateVendorProfile);

module.exports = router;
