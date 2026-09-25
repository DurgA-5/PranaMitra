import { useNavigate } from "react-router-dom";
import { ShieldAlert, LogIn } from "lucide-react";

function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-5 bg-amber-50 text-amber-600 rounded-3xl mb-6 shadow-sm">
        <ShieldAlert size={56} className="stroke-[1.5]" />
      </div>

      <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight">403</h1>
      <h2 className="text-2xl font-bold text-slate-700 mt-4">Access Forbidden</h2>
      <p className="text-slate-500 text-sm max-w-md mt-2 leading-relaxed">
        You do not have permission to view this resource. Please make sure you are logged
        in with the correct user credentials.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition flex items-center gap-2"
        >
          <LogIn size={16} /> Sign In
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

export default Forbidden;
