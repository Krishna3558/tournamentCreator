import { useState } from "react";
import toast from "react-hot-toast";
import { TEAMS } from "../constants/Teams";
import API from "../api/Axios";
import { Navigate, useNavigate } from "react-router";

const CreateTournament = ({ seasonNumber, onClose , onCreated }) => {
  const [teamCount, setTeamCount] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [format, setFormat] = useState("round-robin");

  const navigate = useNavigate();

  const handleTeamSelect = (teamKey) => {
    if (selectedTeams.includes(teamKey)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== teamKey));
    } else {
      if (selectedTeams.length >= teamCount) {
        toast.error(`You can only select ${teamCount} teams`);
        return;
      }
      setSelectedTeams([...selectedTeams, teamKey]);
    }
  };

  const handleSubmit = async () => {
    try{
      if (selectedTeams.length !== Number(teamCount)) {
        return toast.error("Select required number of teams");
      }

      const {data} = await API.post("/season" , {
        seasonNumber,
        format,
        teams: selectedTeams
      })

      if (!data.success) {
        return toast.error(data.message || "Something went wrong");
      }

      toast.success(data.message || "Tournament Created!");
      onCreated();
      onClose();
    }
    catch(error){
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md 
                flex justify-center 
                overflow-y-auto z-50 px-4 py-10">
      
      <div className="bg-white/10 backdrop-blur-xl 
                p-8 rounded-2xl 
                w-full max-w-[600px] 
                shadow-2xl border border-white/20
                max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl md:text-3xl font-bold text-white mb-6 text-center">
          Create Tournament
        </h2>

        {/* Season Number */}
        <div className="mb-4">
          <label className=" text-sm md:text-lg text-gray-300">Season Number</label>
          <input
            value={seasonNumber}
            readOnly
            className="w-full mt-1 p-3 bg-blue-600/30 text-white rounded-lg border border-blue-400/30"
          />
        </div>

        {/* Tournament Format */}
        <div className="mb-6">
          <label className=" text-sm md:text-lg text-gray-300 block mb-2">
            Tournament Format
          </label>

          <div className="flex gap-4">
            <div
              onClick={() => setFormat("round-robin")}
              className={`flex-1 text-sm md:text-lg text-center py-2 rounded-lg cursor-pointer transition border ${
                format === "round-robin"
                  ? "bg-cyan-500/30 border-cyan-400"
                  : "bg-white/10 border-transparent hover:bg-white/20"
              }`}
            >
              Round Robin
            </div>

            <div
              onClick={() => setFormat("double-round-robin")}
              className={`flex-1 text-sm md:text-lg text-center py-2 rounded-lg cursor-pointer transition border ${
                format === "double-round-robin"
                  ? "bg-cyan-500/30 border-cyan-400"
                  : "bg-white/10 border-transparent hover:bg-white/20"
              }`}
            >
              Double Round Robin
            </div>
          </div>
        </div>

        {/* Select Team Count */}
        <div className="mb-6">
          <label className=" text-sm md:text-lg text-gray-300">Number of Teams</label>
          <input
            type="number"
            min="2"
            max="10"
            value={teamCount}
            onChange={(e) => {
              setTeamCount(e.target.value);
              setSelectedTeams([]);
            }}
            className="w-full mt-1 p-3 bg-white/20 text-white rounded-lg"
          />
        </div>

        {/* Team Selection */}
        {teamCount && (
          <div className="flex flex-wrap justify-center gap-3 max-h-64 overflow-y-auto mb-6">
            {Object.entries(TEAMS).map(([key, [name, logo]]) => (
              <div
                key={key}
                onClick={() => handleTeamSelect(key)}
                className={`flex items-center gap-2 w-24 px-3 py-2 rounded-lg cursor-pointer transition border ${
                  selectedTeams.includes(key)
                    ? "bg-cyan-500/30 border-cyan-400"
                    : "bg-white/10 border-transparent hover:bg-white/20"
                }`}
              >
                <img
                  src={logo}
                  alt={name}
                  className="w-6 h-6 object-contain"
                />

                <span className="text-sm font-semibold tracking-wide">
                  {key}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600/50 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg text-white hover:scale-105 transition"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTournament;