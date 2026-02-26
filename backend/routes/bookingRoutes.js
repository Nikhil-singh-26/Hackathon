const express = require("express");
const router = express.Router();
const { requestBooking, getMyBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, requestBooking);
router.get("/my", protect, getMyBookings);

module.exports = router;
