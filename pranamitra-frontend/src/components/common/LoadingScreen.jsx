import logo from "../../assets/logos/pranamitra-logo.jpeg";

function LoadingScreen() {
  const pulseStyle = `
    @keyframes gentle-pulse {
      0%, 100% {
        transform: scale(0.96);
      }
      50% {
        transform: scale(1.04);
      }
    }
    @keyframes text-fade {
      0%, 100% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
    }
    @keyframes loader-spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .animate-gentle-pulse {
      animation: gentle-pulse 1.2s ease-in-out infinite;
    }
    .animate-text-fade {
      animation: text-fade 1.2s ease-in-out infinite;
    }
    .animate-loader-spin {
      animation: loader-spin 2s linear infinite;
    }
  `;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 select-none font-sans">
      <style>{pulseStyle}</style>

      {/* Rotating outer spinner & pulsing logo */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Thin circular loader rotating around the logo */}
        <div className="absolute w-40 h-40 rounded-full border border-slate-100 border-t-[#B71C1C] animate-loader-spin" />
        
        {/* Pulse scale logo container */}
        <div className="w-32 h-32 rounded-3xl bg-white p-1 overflow-hidden shadow-lg animate-gentle-pulse">
          <img
            src={logo}
            alt="PranaMitra Logo"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* System Titles */}
      <div className="text-center space-y-2 max-w-xs">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#212121]">PranaMitra</h1>
        <p className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest">
          Blood Management System
        </p>

        {/* Loading text with fading transition */}
        <p className="text-[#B71C1C] text-sm font-bold tracking-widest mt-6 animate-text-fade">
          Loading...
        </p>

        {/* Bottom medical quotes */}
        <div className="pt-8 border-t border-slate-100 mt-8 space-y-1">
          <p className="text-xs font-bold text-[#212121]">Every Drop Counts.</p>
          <p className="text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">
            Every Donation Saves a Life.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
