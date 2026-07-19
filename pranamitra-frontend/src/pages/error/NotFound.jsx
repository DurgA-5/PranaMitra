import { useNavigate } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-5 bg-red-50 text-red-600 rounded-3xl mb-6 shadow-sm animate-bounce">
        <AlertCircle size={56} className="stroke-[1.5]" />
      </div>

      <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 mt-4">Page Not Found</h2>
      <p className="text-slate-500 text-sm max-w-md mt-2 leading-relaxed">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          Go Back
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition flex items-center gap-2"
        >
          <Home size={16} /> Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
