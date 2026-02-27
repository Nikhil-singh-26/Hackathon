const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};




const signup = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      longitude,
      latitude,
      role,
      businessName,
      description,
      phone
    } = req.body;


    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const domain = email.split('@')[1]?.toLowerCase();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'live.com'];
    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({ message: "Please use a trusted email provider (e.g. Gmail, Outlook, Yahoo)" });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }


    const user = await User.create({
      name,
      username,
      email,
      password,
      role: role || "organizer",
      businessName: role === "vendor" ? businessName : undefined,
      description: role === "vendor" ? description : undefined,
      phone: role === "vendor" ? phone : undefined,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(longitude) || 0,
          parseFloat(latitude) || 0,
        ],
      },
    });

    if (!user) {
      throw new Error("User was not created");
    }


    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role || "user",
        location: user.location,
      },
      token,
    });
  } catch (error) {

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};




const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }


    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }


    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
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
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "There is no user with that email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // In a real app, send email here. For now, we'll just return success.
    // In dev mode, we might want to return the token for testing.
    res.status(200).json({
      message: "Token sent to email",
      // For development purposes, returning the token
      resetToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Password reset successful",
      token,
    });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create a user if they don't exist
      // Since it's google login, we don't have a password. 
      // We should probably generate a random one or make it optional in schema (but it's required now).
      const generatedPassword = crypto.randomBytes(16).toString("hex");

      // Generate a username from email if not provided
      const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

      user = await User.create({
        name,
        username,
        email,
        password: generatedPassword,
        role: "user",
        location: {
          type: "Point",
          coordinates: [0, 0], // Default
        },
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed. Please try again." });
  }
};

module.exports = { signup, login, getMe, forgotPassword, resetPassword, googleLogin };
