const Match = require("../models/Match");
const Season = require("../models/Season");
const PointsTable = require("../models/PointsTable");

const updatePointsAfterMatch = async (match) => {
  const teamA = await PointsTable.findOne({
    seasonId: match.seasonId,
    teamName: match.teamA,
  });

  const teamB = await PointsTable.findOne({
    seasonId: match.seasonId,
    teamName: match.teamB,
  });

  const { teamAScore, teamBScore, result } = match;

  teamA.totalRunsScored += teamAScore;
  teamA.totalRunsConceded += teamBScore;

  teamB.totalRunsScored += teamBScore;
  teamB.totalRunsConceded += teamAScore;

  // Played
  teamA.played++;
  teamB.played++;

  // Result
  if (result === "A") {
    teamA.wins++;
    teamA.points += 2;
    teamB.losses++;
  } else if (result === "B") {
    teamB.wins++;
    teamB.points += 2;
    teamA.losses++;
  } else {
    teamA.ties++;
    teamB.ties++;
    teamA.points += 1;
    teamB.points += 1;
  }

  // Net Run Difference
  teamA.netRunDiff =
    teamA.totalRunsScored - teamA.totalRunsConceded;

  teamB.netRunDiff =
    teamB.totalRunsScored - teamB.totalRunsConceded;

  await teamA.save();
  await teamB.save();
};

const generatePlayoffs = async (seasonId) => {
  const season = await Season.findById(seasonId);
  const teamCount = season.teams.length;

  // 🔥 Get Points Table Sorted
  const pointsTable = await PointsTable.find({ seasonId })
    .sort({ points: -1, netRunDiff: -1 });

  if (teamCount === 4) {
    // 🏆 4 Team Format

    const first = pointsTable[0].teamName;
    const second = pointsTable[1].teamName;
    const third = pointsTable[2].teamName;

    // Create Qualifier (2 vs 3)
    await Match.findOneAndUpdate(
        { seasonId, stage: "qualifier" },
        { teamA: second , teamB: third }
    );

    // Create Final (1st vs TBD)
    await Match.findOneAndUpdate(
        { seasonId, stage: "final" },
        { teamA: first }
      );

  } else if (teamCount > 4) {
    // 🏆 IPL Format

    const first = pointsTable[0].teamName;
    const second = pointsTable[1].teamName;
    const third = pointsTable[2].teamName;
    const fourth = pointsTable[3].teamName;

    // Qualifier 1
    await Match.findOneAndUpdate(
        { seasonId, stage: "qualifier!" },
        { teamA: first , teamB: second }
    );

    // Eliminator
    await Match.findOneAndUpdate(
        { seasonId, stage: "eliminator" },
        { teamA: third , teamB: fourth }
    );
  }
};

const getSeasonMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      seasonId: req.params.seasonId,
    }).sort("matchNumber");

    if(!matches){
      res.json({ success: false , message: "Matches not found"});
    }

    res.json({ success: true , matches});
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const updateMatchResult = async (req, res) => {
  try {
    const { teamAScore, teamBScore } = req.body;

    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({success: false , message: "Match not found" });
    }

    match.teamAScore = teamAScore;
    match.teamBScore = teamBScore;
    match.played = true;

    let winnerTeam = null;

    if (teamAScore > teamBScore) {
      match.result = "A";
      winnerTeam = match.teamA;
    } else if (teamBScore > teamAScore) {
      match.result = "B";
      winnerTeam = match.teamB;
    } else {
      match.result = "Tie";
    }

    if (match.stage === "league") {
      await updatePointsAfterMatch(match);
    }

    await match.save();

    const seasonId = match.seasonId;

    // 🔥 CHECK IF ALL LEAGUE MATCHES ARE COMPLETED
    if (match.stage === "league") {
      const leagueMatches = await Match.find({
        seasonId,
        stage: "league",
      });

      const allLeagueFinished = leagueMatches.every(m => m.played);

      if (allLeagueFinished) {
        await generatePlayoffs(seasonId);
      }
    }

    // 4 TEAM FORMAT
    if (match.stage === "qualifier") {
      await Match.findOneAndUpdate(
        { seasonId, stage: "final", teamB: "TBD" },
        { teamB: winnerTeam }
      );
    }

    // IPL FORMAT

    if (match.stage === "qualifier1") {
      const loser =
        winnerTeam === match.teamA ? match.teamB : match.teamA;

      // Winner → Final slot A
      await Match.findOneAndUpdate(
        { seasonId, stage: "final" },
        { teamA: winnerTeam }
      );

      // Loser → Qualifier2 slot A
      await Match.findOneAndUpdate(
        { seasonId, stage: "qualifier2", teamA: "TBD" },
        { teamA: loser }
      );
    }

    if (match.stage === "eliminator") {
      // Winner → Qualifier2 slot B
      await Match.findOneAndUpdate(
        { seasonId, stage: "qualifier2", teamB: "TBD" },
        { teamB: winnerTeam }
      );
    }

    if (match.stage === "qualifier2") {
      // Winner → Final slot B
      await Match.findOneAndUpdate(
        { seasonId, stage: "final", teamB: "TBD" },
        { teamB: winnerTeam }
      );
    }

    // Final Completed
    if (match.stage === "final") {
      await Season.findByIdAndUpdate(seasonId, {
        winner: winnerTeam,
        status: "completed"
      });
    }

    res.json({ success: true, message: "Result Updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getPointsTable = async (req, res) => {
  try {
    const { seasonId } = req.params;

    const table = await PointsTable.find({ seasonId })
      .sort({ points: -1, netRunDiff: -1 });

    res.json({success: true , table});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getPlayoffMatches = async (req, res) => {
  try {
    const { seasonId } = req.params;

    // Get season to know team count
    const season = await Season.findById(seasonId);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: "Season not found",
      });
    }

    const teamCount = season.teams.length;

    // Fetch all non-league matches
    const matches = await Match.find({
      seasonId,
      stage: { $ne: "league" },
    });

    let formattedMatches = {};

    if (teamCount === 4) {
      // 4 Team Format
      formattedMatches.qualifier = matches.find(
        (m) => m.stage === "qualifier"
      );

      formattedMatches.final = matches.find(
        (m) => m.stage === "final"
      );
    } else {
      // IPL Format
      formattedMatches.qualifier1 = matches.find(
        (m) => m.stage === "qualifier1"
      );

      formattedMatches.eliminator = matches.find(
        (m) => m.stage === "eliminator"
      );

      formattedMatches.qualifier2 = matches.find(
        (m) => m.stage === "qualifier2"
      );

      formattedMatches.final = matches.find(
        (m) => m.stage === "final"
      );
    }

    res.json({
      success: true,
      teamCount,
      matches: formattedMatches,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  updateMatchResult,
  getPointsTable,
  getSeasonMatches,
  getPlayoffMatches
};