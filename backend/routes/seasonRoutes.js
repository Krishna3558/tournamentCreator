const express = require("express");
const { createSeason, getSeasons } = require("../controllers/seasonController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect , createSeason);
router.get("/", protect , getSeasons);

module.exports = router;