const Booking = require("../models/Booking");
const User = require("../models/User");

const requestBooking = async (req, res) => {
  try {
    const { vendorId, date, message } = req.body;

    if (!vendorId || !date) {
      return res.status(400).json({ message: "Vendor ID and Date are required" });
    }

    const booking = await Booking.create({
      organizer: req.user.id,
      vendor: vendorId,
      date,
      message,
    });

    res.status(201).json({ status: "success", data: booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const query = req.user.role === "vendor"
      ? { vendor: req.user.id }
      : { organizer: req.user.id };

    const bookings = await Booking.find(query)
      .populate("vendor", "name businessName email")
      .populate("organizer", "name email")
      .sort("-createdAt");

    res.status(200).json({ status: "success", results: bookings.length, data: bookings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { requestBooking, getMyBookings };
