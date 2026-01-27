const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post(
  "/",
  protect,
  authorize("admin", "warden"),
  createAnnouncement
);

// View announcements (All logged-in users)
router.get("/", protect, getAnnouncements);

module.exports = router;
