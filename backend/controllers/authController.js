const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================================
// Helper: generate JWT
// ============================================================
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ============================================================
// POST /api/auth/signup
// ============================================================
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'live.com'];
    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({ message: "Please use a trusted email provider (e.g. Gmail, Outlook, Yahoo)" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Ensure role validation (fallback to 'user')
    const validRoles = ["user", "vendor", "organizer", "admin"];
    const assignedRole = validRoles.includes(role) ? role : "user";

    // Create user (password hashed by pre-save hook)
    const user = await User.create({ name, email, password, role: assignedRole });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ============================================================
// POST /api/auth/login
// ============================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ============================================================
// GET /api/auth/me  (Protected)
// ============================================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { signup, login, getMe };
