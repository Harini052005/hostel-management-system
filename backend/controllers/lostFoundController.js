const LostFound = require("../modules/LostFound");

// Create Lost / Found Item
const createItem = async (req, res) => {
  try {
    const { title, description, type, location, itemDate, images } = req.body;

    const item = await LostFound.create({
      title,
      description,
      type,
      location,
      itemDate: itemDate ? new Date(itemDate) : undefined,
      images: Array.isArray(images) ? images : (images ? [images] : []),
      reportedBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Items
const getItems = async (req, res) => {
  try {
    const items = await LostFound.find()
      .populate("reportedBy", "name role")
      .populate("claimedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Claim item (student)
const claimItem = async (req, res) => {
  try {
    const { message } = req.body;
    const item = await LostFound.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.type !== "found") return res.status(400).json({ message: "Only found items can be claimed" });
    if (item.claimStatus === "pending") return res.status(400).json({ message: "Claim already pending" });
    if (item.claimStatus === "accepted") return res.status(400).json({ message: "Item already claimed" });

    item.claimedBy = req.user._id;
    item.claimMessage = message || "";
    item.claimStatus = "pending";

    await item.save();

    res.status(200).json({ message: "Claim submitted and pending admin review", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin/warden accept or reject claim
const handleClaim = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const item = await LostFound.findById(req.params.id);

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    if (item.claimStatus !== "pending") {
      return res.status(400).json({ message: "No pending claim to process" });
    }

    if (action === "accept") {
      item.claimStatus = "accepted";
      item.status = "claimed";
    } else {
      item.claimStatus = "rejected";
      item.claimedBy = null;
      item.claimMessage = null;
    }

    await item.save();

    res.status(200).json({ message: `Claim ${action}ed`, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resolve Item
const resolveItem = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = "resolved";
    await item.save();

    res.json({ message: "Item marked as resolved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  resolveItem,
  claimItem,
  handleClaim,
};
