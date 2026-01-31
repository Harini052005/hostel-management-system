const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// Logger 
app.use(logger);

// CORS 
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ISSUE ROUTES CONNECTION

const issueRoutes = require("./routes/issueRoutes");
app.use("/api/v1/issues", issueRoutes);

// ANNOUNCEMENTS ROUTES CONNECTION

const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/v1/announcements", announcementRoutes);

// LOSTFOUND ROUTES CONNECTION
const lostFoundRoutes = require("./routes/lostFoundRoutes");
app.use("/api/lost-found", lostFoundRoutes);


connectDB();


app.use("/api/v1/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Smart Hostel API running");
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

