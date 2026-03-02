const mongoose = require("mongoose");

const pointsTableSchema = new mongoose.Schema(
  {
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },

    teamName: {
      type: String,
      required: true,
    },

    played: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 },

    points: { type: Number, default: 0 },

    totalRunsScored: { type: Number, default: 0 },
    totalRunsConceded: { type: Number, default: 0 },

    netRunDiff: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent duplicate entry for same team in same season
pointsTableSchema.index({ seasonId: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model("PointsTable", pointsTableSchema);