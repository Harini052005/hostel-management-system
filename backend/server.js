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

// ISSUE ROUTES CONNECTION

const issueRoutes = require("./routes/issueRoutes");
app.use("/api/v1/issues", issueRoutes);


/* ======================
   DATABASE CONNECTION
====================== */
connectDB();

/* ======================
   GLOBAL MIDDLEWARE
====================== */

// 👇 Logger (should be first – logs all requests)
app.use(logger);

// 👇 CORS (before routes)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// 👇 Body parser
app.use(express.json());

/* ======================
   ROUTES
====================== */
app.use("/api/v1/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Smart Hostel API running");
});

/* ======================
   ERROR HANDLER
====================== */
// 👇 MUST be last
app.use(errorHandler);

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

