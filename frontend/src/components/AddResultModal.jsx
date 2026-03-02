import { useState } from "react";
import API from "../api/Axios";
import toast from "react-hot-toast";

const AddResultModal = ({ match, onClose, onSuccess }) => {
  const [scoreA, setScoreA] = useState("");
  const [scoreB, setScoreB] = useState("");

  const handleSubmit = async () => {
    if (scoreA === "" || scoreB === "") {
      return toast.error("Enter both scores");
    }

    try {
      const {data} = await API.put(`/matches/result/${match._id}`, {
        teamAScore: Number(scoreA),
        teamBScore: Number(scoreB),
      });

      if(!data.success){
        toast.error(data.message || "Match not found");
        return;
      }

      toast.success(data.message || "Result Declared Successfully");
      onSuccess();
    } catch (err) {
      toast.error("Failed to update result");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">

      <div className="w-[450px] p-8 rounded-2xl shadow-2xl bg-linear-to-br from-[#0f2027] via-[#1c3b52] to-[#2c5364]">

        {/* 🔥 Match Info */}
        <h2 className="text-2xl text-yellow-400 font-bold text-center mb-4">
          {match.teamA} 🆚 {match.teamB}
        </h2>

        <p className="text-center text-gray-300 mb-6">
          ⚠ You cannot edit result after submission
        </p>

        {/* Score Inputs */}
        <div className="space-y-4">
          <input
            type="number"
            placeholder={`${match.teamA} Score`}
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white"
          />

          <input
            type="number"
            placeholder={`${match.teamB} Score`}
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:scale-105 transition"
          >
            Submit Result
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddResultModal;