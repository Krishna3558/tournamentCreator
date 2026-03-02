import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import API from "../api/Axios";
import toast from "react-hot-toast";
import { TEAMS } from "../constants/Teams";

const PointsTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [table, setTable] = useState([]);

  const fetchTable = async () => {
    try {
      const { data } = await API.get(`/matches/points-table/${id}`);
      if (!data.success) {
        toast.error("Failed to load points table");
        return;
      }

      setTable(data.table);
    } catch (error) {
      toast.error("Error loading table");
    }
  };

  useEffect(() => {
    fetchTable();
  }, []);

  const qualificationLimit = table.length === 4 ? 3 : 4;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f2027] via-[#1c3b52] to-[#2c5364] text-white p-8">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-base md:text-3xl font-bold">
          🏆 Points Table
        </h1>

        <button
          onClick={() => navigate(`/season/schedule/${id}`)}
          className="px-3 md:px-5 py-2 rounded-lg text-xs md:text-lg bg-linear-to-r from-blue-400/20 to-blue-500/10 
              border border-blue-400/30 
                     hover:scale-105 transition"
        >
          📅 Go To Matches
        </button>
      </div>

      {/* 🔥 Table Container */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">

      <div className="overflow-x-auto">
        <div className="min-w-120">

        {/* Table Header */}
        <div className="grid grid-cols-8 px-5 py-3 bg-white/5 text-yellow-300 font-semibold text-sm whitespace-nowrap">
          <span>Pos</span>
          <span className="col-span-2">Team</span>
          <span>M</span>
          <span>W</span>
          <span>L</span>
          <span>Pts</span>
          <span>NRR</span>
        </div>

        {/* Table Rows */}
        {table.map((team, index) => (
        <div key={team._id}>

            <div className="grid grid-cols-8 items-center 
                    px-5 py-3 
                    border-t border-white/10 
                    text-sm whitespace-nowrap">

            {/* Position */}
            <span className="font-bold">{index + 1}</span>

            {/* Team Column */}
            <div className="col-span-2 flex items-center gap-2">
                {TEAMS[team.teamName] && (
                <img
                    src={TEAMS[team.teamName][1]}
                    className="w-8 h-6 object-cover"
                />
                )}
                <span className="font-semibold">
                {team.teamName}
                </span>
            </div>

            {/* Matches Played */}
            <span>{team.played}</span>

            {/* Wins */}
            <span className="text-green-400">
                {team.wins}
            </span>

            {/* Losses */}
            <span className="text-red-400">
                {team.losses}
            </span>

            {/* Points */}
            <span className="font-bold text-yellow-300">
                {team.points}
            </span>

            {/* Net Run Difference */}
            <span
                className={`font-semibold ${
                team.netRunDiff >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
            >
                {team.netRunDiff > 0 ? "+" : ""}
                {team.netRunDiff}
            </span>

            </div>

            {/* 🔥 Qualification Line */}
            {index === qualificationLimit - 1 && (
            <div className="border-t-2 border-dashed border-yellow-400/50"></div>
            )}

        </div>
        ))}
        </div>
        </div>

      </div>

      {/* Footer Note */}
      <p className="mt-6 text-sm text-gray-400">
        Top {qualificationLimit} teams qualify for playoffs
      </p>

    </div>
  );
};

export default PointsTable;