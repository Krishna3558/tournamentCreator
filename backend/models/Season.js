const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    seasonNumber: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    format: {
      type: String,
      enum: ["round-robin", "double-round-robin"],
      required: true,
    },

    teams: [
      {
        type: String,
        required: true,
      },
    ],

    winner: {
      type: String,
      default: "TBD"
    },

    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Season", seasonSchema);