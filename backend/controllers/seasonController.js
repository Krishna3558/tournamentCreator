const Match = require("../models/Match");
const Season = require("../models/Season");
const PointsTable = require("../models/PointsTable");

const generateRounds = (teamsInput) => {
    const teams = [...teamsInput];
  const rounds = [];

  if (teams.length % 2 !== 0) {
    teams.push("BYE");
  }

  const numTeams = teams.length;
  const numRounds = numTeams - 1;
  const half = numTeams / 2;

  const teamList = [...teams];

  for (let round = 0; round < numRounds; round++) {
    const roundMatches = [];

    for (let i = 0; i < half; i++) {
      const home = teamList[i];
      const away = teamList[numTeams - 1 - i];

      if (home !== "BYE" && away !== "BYE") {
        roundMatches.push([home, away]);
      }
    }

    rounds.push(roundMatches);

    // Rotate (except first team)
    const fixed = teamList[0];
    const rotated = [fixed]
      .concat(teamList.slice(-1))
      .concat(teamList.slice(1, -1));

    teamList.splice(0, teamList.length, ...rotated);
  }

  return rounds;
};

const generateDoubleRoundRobin = (teams) => {
  const firstLeg = generateRounds([...teams]);

  const secondLeg = firstLeg.map(round =>
    round.map(([a, b]) => [b, a])
  );

  return [...firstLeg, ...secondLeg];
};

const createSeason = async(req , res) => {
    try{
        const { seasonNumber, teams, format } = req.body;

        const userId = req.user._id;

        const existing = await Season.findOne({
          seasonNumber,
          createdBy: userId,
        });

        if (existing) {
          return res.status(400).json({
            success: false,
            message: "Season number already exists",
          });
        }

        const season = await Season.create({
            seasonNumber,
            teams,
            format,
            createdBy: userId,
        });

        const pointsEntries = teams.map(team => ({
            seasonId: season._id,
            teamName: team,
        }));

        await PointsTable.insertMany(pointsEntries);

        let rounds = [];
    
        if (season.format === "double-round-robin") {
            rounds = generateDoubleRoundRobin(teams);
        } else {
            rounds = generateRounds(teams);
        }
    
        let matchNumber = 1;
        const matches = [];
    
        rounds.forEach((round, roundIndex) => {
            round.forEach(match => {
            matches.push({
                seasonId: season._id,
                matchNumber: matchNumber++,
                round: roundIndex + 1,
                teamA: match[0],
                teamB: match[1],
                stage: "league",
            });
            });
        });
    
        if (teams.length === 4) {
            // 4 Team Format:
            // Top 1 → Final
            // 2 vs 3 → Qualifier
            // Then winner plays Final
    
            matches.push({
            seasonId: season._id,
            matchNumber: matchNumber++,
            teamA: "TBD",
            teamB: "TBD",
            stage: "qualifier",
            });
    
            matches.push({
            seasonId: season._id,
            matchNumber: matchNumber++,
            teamA: "TBD",
            teamB: "TBD",
            stage: "final",
            });
    
        } else {
            // 5-10 Teams → IPL Style Top 4
    
            matches.push({
            seasonId: season._id,
            matchNumber: matchNumber++,
            teamA: "TBD",
            teamB: "TBD",
            stage: "qualifier1",
            });
    
            matches.push({
            seasonId: season._id,
            matchNumber: matchNumber++,
            teamA: "TBD",
            teamB: "TBD",
            stage: "eliminator",
            });
    
            matches.push({
            seasonId: season._id,
            matchNumber: matchNumber++,
            teamA: "TBD",
            teamB: "TBD",
            stage: "qualifier2",
            });
    
            matches.push({
            seasonId: season._id,
            matchNumber: matchNumber++,
            teamA: "TBD",
            teamB: "TBD",
            stage: "final",
            });
        }
    
        await Match.insertMany(matches);
        
        res.status(201).json({ success: true, message: "Season Created and Matches Generated, You can see them in schedule and results section" });
    }
    catch(error){
        res.status(500).json({ message: "Server Error" });
    }
}

const getSeasons = async (req, res) => {
  try {
    const userId = req.user._id;
    const seasons = await Season.find({
        createdBy: userId
    }).sort({ seasonNumber: -1 });

    res.json({
      success: true,
      count: seasons.length,
      seasons,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
    createSeason,
    getSeasons
}