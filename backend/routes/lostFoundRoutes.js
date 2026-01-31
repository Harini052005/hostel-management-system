const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  resolveItem,
  claimItem,
  handleClaim,
} = require("../controllers/lostFoundController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Student reports lost/found
router.post("/", protect, authorize("student"), createItem);

// All users can view
router.get("/", protect, getItems);

// Students can submit claims for found items
router.post("/:id/claim", protect, authorize("student"), claimItem);

// Admin/Warden process claim (accept/reject)
router.patch("/:id/claim", protect, authorize("admin", "warden"), handleClaim);

// Admin/Warden resolves
router.patch(
  "/:id/resolve",
  protect,
  authorize("admin", "warden"),
  resolveItem
);

module.exports = router;
