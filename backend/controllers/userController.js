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

    // Filter only for vendors/users who are active and have location sharing enabled
    const query = {
      status: "active",
      isLocationSharing: true,
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

    const users = await User.find(query).select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Nearby search error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ============================================================
// Update Vendor Profile (for Vendors)
// ============================================================
const updateVendorProfile = async (req, res) => {
  try {
    const { 
      businessName, 
      description, 
      phone, 
      isLocationSharing, 
      status,
      longitude,
      latitude
    } = req.body;

    const updates = {
      businessName,
      description,
      phone,
      isLocationSharing,
      status
    };

    if (longitude !== undefined && latitude !== undefined) {
      updates.location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// Get all vendors (for Organizers)
// ============================================================
const getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor", status: "active" }).select("-password");
    res.status(200).json({ status: "success", results: vendors.length, data: vendors });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

module.exports = { getNearbyUsers, updateVendorProfile, getVendors, updateLocation };
