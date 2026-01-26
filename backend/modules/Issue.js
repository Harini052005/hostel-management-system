const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["plumbing", "electrical", "cleanliness", "internet", "furniture", "other"],
      required: true
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "emergency"],
      default: "low"
    },

    status: {
      type: String,
      enum: ["reported", "assigned", "in_progress", "resolved", "closed"],
      default: "reported"
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    hostel: String,
    block: String,
    room: String,

    remarks: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
