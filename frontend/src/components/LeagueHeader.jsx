import { useNavigate } from "react-router";

const LeagueHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 w-full bg-linear-to-r from-[#0a0f2c] via-[#0f1b4d] to-[#09143a] border-b border-blue-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">

        {/* LEFT SIDE - LOGO + NAME */}
        <div className="flex items-center gap-3">

          <div className="leading-tight">
            <h1 className="text-blue-400 text-xs md:text-base font-semibold tracking-wider uppercase">
              Naraina Premium League
            </h1>
            <p className="text-[10px] md:text-xs text-blue-300/70 tracking-widest">
              Official Tournament Portal
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - DASHBOARD BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="px-4 py-1.5 text-xs md:text-sm rounded-md border border-blue-400/30 
                     text-blue-300 hover:bg-blue-500/20 
                     hover:text-blue-200 transition-all duration-300"
        >
          Dashboard
        </button>

      </div>
    </header>
  );
};

export default LeagueHeader;