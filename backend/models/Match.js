const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },

    matchNumber: {
      type: Number,
      required: true,
    },

    teamA: {
      type: String,
      required: true,
      default: "TBD",
    },

    teamB: {
      type: String,
      required: true,
      default: "TBD",
    },

    teamAScore: {
      type: Number,
      default: 0,
    },

    teamBScore: {
      type: Number,
      default: 0,
    },

    result: {
      type: String,
      enum: ["A", "B", "Tie", null],
      default: null,
    },

    played: {
      type: Boolean,
      default: false,
    },

    stage: {
      type: String,
      enum: ["league", "qualifier" , "qualifier1", "eliminator", "qualifier2", "final"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Match", matchSchema);