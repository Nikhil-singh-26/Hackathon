const User = require("../models/User");

// ============================================================
// GET /api/users/nearby
// ============================================================
const getNearbyUsers = async (req, res) => {
  try {
    const { lat, lng, radius, role } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    // Default radius to 10km if not provided
    const radiusInKm = parseFloat(radius) || 10;
    const radiusInMeters = radiusInKm * 1000;

    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radiusInMeters,
        },
      },
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query);

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Nearby search error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ============================================================
// PUT /api/users/location
// ============================================================
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.location = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    await user.save();

    res.status(200).json({
      message: "Location updated successfully",
      location: user.location,
    });
  } catch (error) {
    console.error("Update location error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { getNearbyUsers, updateLocation };
