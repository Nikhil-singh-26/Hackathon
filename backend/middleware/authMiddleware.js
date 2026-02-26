const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized — no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized — user no longer exists" });
    }

    req.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Not authorized — invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Not authorized — token expired" });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { protect };
