import { TEAMS } from "../constants/Teams";

const SeasonCard = ({ season, onClick }) => {
  const isCompleted = season.status === "completed";
  const winner = season.winner;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer 
                 bg-white/5 border border-white/10 
                 p-6 rounded-xl 
                 flex flex-col gap-4 
                 hover:bg-white/10 
                 transition-all duration-300 
                 backdrop-blur-md"
    >
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className=" text-base md:text-2xl font-semibold text-white">
            Season {season.seasonNumber}
          </h2>

          <p className="text-gray-400 mt-1 text-xs md:text-sm">
            Teams: {season.teams.length}
          </p>
        </div>

        <span
          className={`px-2 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium ${
            isCompleted
              ? "text-green-400 bg-green-500/10"
              : "text-yellow-400 bg-yellow-500/10"
          }`}
        >
          {isCompleted ? "Completed" : "Ongoing"}
        </span>
      </div>

      {/* Winner Section */}
      {isCompleted && winner && (
        <div className="mt-2 border-t border-white/10 pt-4 
                        flex items-center justify-center gap-3">


          {/* Logo */}
          {TEAMS[winner] && (
            <img
              src={TEAMS[winner][1]}
              alt={winner}
              className="w-8 h-6 object-cover opacity-90"
            />
          )}

          {/* Team Name */}
          <span className="font-mono uppercase tracking-widest 
                           text-gray-200 text-xs md:text-lg">
            {TEAMS[winner]?.[0] || winner}
          </span>
        </div>
      )}
    </div>
  );
};

export default SeasonCard;