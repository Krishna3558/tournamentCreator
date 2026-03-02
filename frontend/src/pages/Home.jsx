import { useEffect, useState } from "react";
import SeasonCard from "../components/SeasonCard";
import SeasonPanel from "../components/SeasonPanel";
import CreateTournament from "../components/CreateTournament";
import toast from "react-hot-toast";
import API from "../api/Axios";

const Home = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSeasons = async () => {
    try {
      const { data } = await API.get("/season/");
      setSeasons(data.seasons);
    } catch (err) {
      toast.error("Failed to load seasons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-8 relative">

      <h1 className="text-4xl font-bold text-center mb-10">
        🏏 All Seasons
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin h-14 w-14 border-t-4 border-cyan-400 border-opacity-70 rounded-full"></div>
        </div>
      ) : seasons.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-center">
          
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-md w-full">
            
            <div className="text-6xl mb-4">🏏</div>

            <h2 className="text-2xl font-semibold mb-2">
              No Tournaments Yet
            </h2>

            <p className="text-gray-300 mb-6">
              You haven’t created any season. Start your first tournament now!
            </p>

            <button
              onClick={() => setShowCreate(true)}
              className=" px-3 md:px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full font-semibold hover:scale-105 transition duration-300"
            >
              + Create First Tournament
            </button>

          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {seasons.map((season) => (
            <SeasonCard
              key={season._id}
              season={season}
              onClick={() => setSelectedSeason(season)}
            />
          ))}
        </div>
      )}

      {selectedSeason && (
        <SeasonPanel
          season={selectedSeason}
          onClose={() => setSelectedSeason(null)}
        />
      )}

      {showCreate && (
        <CreateTournament
          seasonNumber={seasons.length + 1}
          onClose={() => setShowCreate(false)}
          onCreated={fetchSeasons}
        />
      )}

      {/* Create Button */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-8 right-8 text-sm md:text-lg px-3 md:px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full shadow-xl hover:scale-110 transition"
      >
        + Create Tournament
      </button>
    </div>
  );
};

export default Home;