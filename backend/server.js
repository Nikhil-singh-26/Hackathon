const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// ============================================================
// Initialize Express
// ============================================================
const app = express();

// ============================================================
// Middleware
// ============================================================
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10kb" })); // Body parser with size limit
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Routes
// ============================================================
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "EventFlex API is running" });
});

app.use("/api/auth", authRoutes);

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