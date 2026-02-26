const express = require("express");
const router = express.Router();
const { getNearbyUsers, updateVendorProfile, getVendors, updateLocation, updateAvailability, getUserById } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Organizer routes
router.get("/nearby", protect, authorizeRoles("organizer", "admin"), getNearbyUsers);
router.get("/vendors", protect, authorizeRoles("organizer", "admin"), getVendors);

// Vendor routes
router.patch("/update-profile", protect, authorizeRoles("vendor", "admin"), updateVendorProfile);

// Update location route
router.put("/location", protect, updateLocation);

// Vendor availability
router.patch("/availability", protect, authorizeRoles("vendor", "admin"), updateAvailability);

// Get specific user
router.get("/:id", protect, getUserById);

module.exports = router;
