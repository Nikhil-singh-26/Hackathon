const User = require("../models/User");

// ============================================================
// GET /api/users/nearby
// ============================================================
const getNearbyUsers = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Default radius to 10km if not provided
    const radiusInKm = parseFloat(radius) || 10;
    const radiusInMeters = radiusInKm * 1000;

    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Nearby search error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { getNearbyUsers };
