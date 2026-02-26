const express = require("express");
const router = express.Router();
const { getNearbyUsers, updateVendorProfile, getVendors, updateLocation, updateAvailability, getUserById } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");


router.get("/nearby", protect, authorizeRoles("organizer", "admin"), getNearbyUsers);
router.get("/vendors", protect, authorizeRoles("organizer", "admin"), getVendors);


router.patch("/update-profile", protect, authorizeRoles("vendor", "admin"), updateVendorProfile);


router.put("/location", protect, updateLocation);


router.patch("/availability", protect, authorizeRoles("vendor", "admin"), updateAvailability);


router.get("/:id", protect, getUserById);

module.exports = router;
