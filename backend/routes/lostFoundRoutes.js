const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  resolveItem,
} = require("../controllers/lostFoundController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Student reports lost/found
router.post("/", protect, authorize("student"), createItem);

// All users can view
router.get("/", protect, getItems);

// Admin/Warden resolves
router.patch(
  "/:id/resolve",
  protect,
  authorize("admin", "warden"),
  resolveItem
);

module.exports = router;
