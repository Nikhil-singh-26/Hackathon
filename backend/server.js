const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// ============================================================
// Initialize Express
// ============================================================
const app = express();

// ============================================================
// Middleware
// ============================================================
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10kb" })); // Body parser with size limit
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Routes
// ============================================================
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "EventFlex API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ============================================================
// 404 Handler
// ============================================================
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ============================================================
// Start Server
// ============================================================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});