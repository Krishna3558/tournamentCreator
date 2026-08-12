const express = require("express");
const { getSeasonMatches, getPointsTable, updateMatchResult, getPlayoffMatches } = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get('/:seasonId' , protect , getSeasonMatches);
router.get('/points-table/:seasonId' , protect , getPointsTable);
router.put('/result/:matchId' , protect , updateMatchResult);
router.get("/playoffs/:seasonId" , protect , getPlayoffMatches);

module.exports = router;