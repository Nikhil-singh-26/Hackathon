const User = require("../models/User");




const getNearbyUsers = async (req, res) => {
  try {
    const { lat, lng, radius, role } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }


    const radiusInKm = parseFloat(radius) || 10;
    const radiusInMeters = radiusInKm * 1000;


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

    const users = await User.find(query).select("-password +availability");

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




const getVendors = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: "vendor", status: "active" };

    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const vendors = await User.find(query).select("-password +availability");
    res.status(200).json({ status: "success", results: vendors.length, data: vendors });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




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




const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password +availability");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID or server error" });
  }
};




const updateAvailability = async (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });


    if (!user.availability) user.availability = [];

    const index = user.availability.indexOf(date);
    if (index > -1) {
      user.availability.splice(index, 1);
    } else {
      user.availability.push(date);
    }

    await user.save();
    res.status(200).json({ status: "success", availability: user.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNearbyUsers, updateVendorProfile, getVendors, updateLocation, updateAvailability, getUserById };
