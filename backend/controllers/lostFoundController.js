const LostFound = require("../modules/LostFound");

// Create Lost / Found Item
const createItem = async (req, res) => {
  try {
    const { title, description, type, location } = req.body;

    const item = await LostFound.create({
      title,
      description,
      type,
      location,
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
      .sort({ createdAt: -1 });

    res.json(items);
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
};
