import { useNavigate } from "react-router-dom";
import { ServerCrash, RefreshCw } from "lucide-react";

function ServerError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-5 bg-red-50 text-red-600 rounded-3xl mb-6 shadow-sm">
        <ServerCrash size={56} className="stroke-[1.5]" />
      </div>

      <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight">500</h1>
      <h2 className="text-2xl font-bold text-slate-700 mt-4">Internal Server Error</h2>
      <p className="text-slate-500 text-sm max-w-md mt-2 leading-relaxed">
        The server encountered an internal error or misconfiguration and was unable
        to complete your request. Please try again shortly.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition flex items-center gap-2"
        >
          <RefreshCw size={16} /> Reload Page
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default ServerError;
