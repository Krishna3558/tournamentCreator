import { useNavigate } from "react-router";

const SeasonPanel = ({ season, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">

      <div className="relative w-[500px] max-w-[90%] p-8 rounded-2xl shadow-2xl 
        bg-linear-to-br from-[#0f2027] via-[#1c3b52] to-[#2c5364] 
        border border-white/10">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-400 hover:text-red-500 transition"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className=" text-xl md:text-3xl font-bold text-center mb-8 tracking-wide">
          Season {season.seasonNumber}
        </h2>

        {/* Navigation Buttons */}
        <div className="space-y-6">

          <button
            onClick={() => navigate(`/season/schedule/${season._id}`)}
            className="w-full py-4 rounded-xl 
              bg-linear-to-r from-blue-400/20 to-blue-500/10 
              border border-blue-400/30 font-semibold text-sm md:text-lg
              hover:scale-105 shadow-xl hover:shadow-2xl
              transition duration-300"
          >
            📅 Schedule & Results
          </button>

          <button
            onClick={() => navigate(`/season/points-table/${season._id}`)}
            className="w-full py-4 rounded-xl 
              bg-linear-to-r from-blue-400/20 to-blue-500/10 
              border border-blue-400/30 font-semibold text-sm md:text-lg
              hover:scale-105 shadow-xl hover:shadow-2xl 
              transition duration-300"
          >
            🏆 Points Table
          </button>

        </div>

      </div>
    </div>
  );
};

export default SeasonPanel;