const Announcement = require("../modules/Announcement");

// ADMIN / WARDEN: Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetRole } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const announcement = await Announcement.create({
      title,
      message,
      targetRole: targetRole || "all",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({
      message: "Server error while creating announcement",
    });
  }
};

// STUDENT / ALL: View announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;

    const announcements = await Announcement.find({
      isActive: true,
      $or: [{ targetRole: "all" }, { targetRole: userRole }],
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name role");

    res.status(200).json({
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Get announcements error:", error);
    res.status(500).json({
      message: "Server error while fetching announcements",
    });
  }
};
