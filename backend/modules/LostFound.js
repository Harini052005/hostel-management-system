const mongoose = require("mongoose");

const lostFoundSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    // Date when item was lost/found (optional)
    itemDate: Date,

    // images: array of URLs (keep simple for now)
    images: [String],

    status: {
      type: String,
      enum: ["open", "claimed", "resolved"],
      default: "open",
    },

    // Claim workflow
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    claimMessage: String,
    claimStatus: {
      type: String,
      enum: ["none", "pending", "accepted", "rejected"],
      default: "none",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostFound", lostFoundSchema);
