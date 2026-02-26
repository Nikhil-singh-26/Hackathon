const express = require("express");
const router = express.Router();
const { getNearbyUsers } = require("../controllers/userController");

// Nearby search route
router.get("/nearby", getNearbyUsers);

module.exports = router;
