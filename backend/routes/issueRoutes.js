const express = require("express");
const router = express.Router();

const {
  reportIssue,
  getIssues,
  updateIssueStatus,
  assignIssue
} = require("../controllers/issueController");


const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Student
router.post("/", protect, authorize("student"), reportIssue);

// Student + Management
router.get("/", protect, getIssues);


// Management only
router.patch("/:id/status", protect, authorize("admin", "warden"), updateIssueStatus);
router.patch("/:id/assign", protect, authorize("admin", "warden"), assignIssue);



module.exports = router;
