const Issue = require("../modules/Issue");

/**
 * @desc    Report a new issue
 * @route   POST /api/v1/issues
 * @access  Student
 */
exports.reportIssue = async (req, res) => {
  try {
    const { title, description, category, priority, visibility } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      priority,
      visibility,
      reportedBy: req.user.id,
      hostel: req.user.hostel,
      block: req.user.block,
      room: req.user.room
    });

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all issues
 * @route   GET /api/v1/issues
 * @access  Student / Management
 */
exports.getIssues = async (req, res) => {
  try {
    let filter = {};

    // Student: only own issues + public issues
    if (req.user.role === "student") {
      filter = {
        $or: [
          { visibility: "public" },
          { reportedBy: req.user.id }
        ]
      };
    }

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name role")
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update issue status
 * @route   PATCH /api/v1/issues/:id/status
 * @access  Management
 */
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    if (remarks) issue.remarks = remarks;

    await issue.save();

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Assign issue to caretaker
 * @route   PATCH /api/v1/issues/:id/assign
 * @access  Management
 */
exports.assignIssue = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.assignedTo = assignedTo;
    issue.status = "assigned";

    await issue.save();

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
