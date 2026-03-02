const express = require("express");
const { getSeasonMatches, getPointsTable, updateMatchResult, getPlayoffMatches } = require("../controllers/matchController");
const router = express.Router();

router.get('/:seasonId' , getSeasonMatches);
router.get('/points-table/:seasonId' , getPointsTable);
router.put('/result/:matchId' , updateMatchResult);
router.get("/playoffs/:seasonId", getPlayoffMatches);

module.exports = router;