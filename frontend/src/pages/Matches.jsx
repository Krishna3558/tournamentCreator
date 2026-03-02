import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../api/Axios";
import toast from "react-hot-toast";
import { TEAMS } from "../constants/Teams";
import AddResultModal from "../components/AddResultModal";

const Matches = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = async () => {
    try {
      const { data } = await API.get(`/matches/${id}`);
      if(!data.success){
        toast.error(data.message || "No find matches");
        return;
      }
      console.log(data.matches);   
      setMatches(data.matches);
    } catch (err) {
      toast.error("Failed to load matches");
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f2027] via-[#1c3b52] to-[#2c5364] text-white p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className=" text-base md:text-3xl font-bold ">
          Schedule & Results
        </h1>

        <button
          onClick={() => navigate(`/season/points-table/${id}`)}
          className=" px-3 md:px-5 py-2 text-xs md:text-lg rounded-lg bg-linear-to-r from-blue-400/20 to-blue-500/10 
              border border-blue-400/30   hover:scale-105 transition"
        >
          🏆Points Table
        </button>
      </div>

      {/* Matches List */}
      <div className="space-y-6">
        {matches.map((match) => {
          const teamA = match.teamA;
          const teamB = match.teamB;

          return (
            <div
              key={match._id}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl 
                        flex flex-col md:flex-row 
                        md:items-center md:justify-between 
                        gap-4 md:gap-0"
            >
              
              {/* LEFT SECTION (Match No + Teams) */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">

                {/* 🔥 Stage / Match Number */}
                <div className="text-lg text-yellow-300 font-semibold">
                  {match.stage === "league"
                    ? `Match ${match.matchNumber}`
                    : match.stage.toUpperCase()}
                </div>

                {/* Teams Row */}
                <div className="flex items-center justify-center gap-8 w-full">

                  {/* 🔹 TEAM A */}
                  <div className="flex items-center gap-3">

                    {/* Logo + Name stacked */}
                    <div className="flex flex-col items-center">
                      {teamA !== "TBD" && TEAMS[teamA] && (
                        <img
                          src={TEAMS[teamA][1]}
                          className="w-8 h-6 object-cover"
                        />
                      )}
                      <span className="font-semibold text-center">{teamA}</span>
                    </div>

                    {/* Score (only if played) */}
                    {match.played && (
                      <span className={` font-bold text-lg ${match.result === "A" ? "text-green-400" : "text-red-500"}`}>
                        {match.teamAScore}
                      </span>
                    )}
                  </div>

                  {/* 🔸 VS */}
                  <span className="text-yellow-400 font-bold text-lg">VS</span>

                  {/* 🔹 TEAM B */}
                  <div className="flex items-center gap-3">

                    {/* Score (only if played) */}
                    {match.played && (
                      <span className={` font-bold text-lg ${match.result === "B" ? "text-green-400" : "text-red-500"}`}>
                        {match.teamBScore}
                      </span>
                    )}

                    {/* Logo + Name stacked */}
                    <div className="flex flex-col items-center">
                      {teamB !== "TBD" && TEAMS[teamB] && (
                        <img
                          src={TEAMS[teamB][1]}
                          className="w-8 h-6 object-cover"
                        />
                      )}
                      <span className="font-semibold text-center">{teamB}</span>
                    </div>

                  </div>

                </div>

                

              </div>

              {/* RIGHT SECTION (Result / Button) */}
              <div>
                {match.played ? (
                  <div className="text-cyan-400 font-bold text-lg text-left md:text-right">
                    {match.result === "A" ? `${teamA} Won` : `${teamB} Won`}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedMatch(match)}
                    className="w-full md:w-auto px-4 py-2 
                              bg-cyan-500/30 border border-cyan-400 
                              rounded-lg hover:scale-105 transition"
                  >
                    Add Result
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {selectedMatch && (
        <AddResultModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSuccess={() => {
            fetchMatches();
            setSelectedMatch(null);
          }}
        />
      )}

    </div>
  );
};

export default Matches;