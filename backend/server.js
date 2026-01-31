const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(logger);

// ✅ CORS (TEMP: allow all origins)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/issues", issueRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/lost-found", lostFoundRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Smart Hostel API running 🚀");
});

// Error handler
app.use(errorHandler);

// DB connection
connectDB();

// ✅ EXPORT APP (VERY IMPORTANT)
module.exports = app;
