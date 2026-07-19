import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Droplets, ClipboardList, CheckCircle, XCircle, AlertTriangle,
  Calendar, Hospital, User2, Sparkles, RefreshCw
} from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";

const BLOOD_GROUPS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-3.5 rounded-xl ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{value ?? 0}</h3>
      </div>
    </div>
  );
}

function Dashboard() {
  const userId = getUserId();
  const fullName = localStorage.getItem("fullName") || "Patient";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await patientPortalService.getDashboardData(userId);
      setStats(data);
    } catch (err) {
      console.error("Dashboard load error:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-48 bg-white rounded-2xl md:col-span-3" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            Patient Portal <Sparkles className="text-red-500 animate-pulse" size={24} />
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Track your blood requests and manage your profile.</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {stats?.fullName || fullName}!</h2>
            <p className="text-red-100 text-sm mt-1 leading-relaxed max-w-xl">
              Your health journey is our priority. Monitor your blood requests and stay connected with your healthcare team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold shrink-0">
            {stats?.bloodGroup && (
              <span className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <Droplets size={16} className="text-red-100" />
                {BLOOD_GROUPS[stats.bloodGroup] ?? stats.bloodGroup}
              </span>
            )}
            {stats?.hospitalName && (
              <span className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                <Hospital size={16} className="text-red-100" />
                {stats.hospitalName}
              </span>
            )}
            {stats?.city && (
              <span className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                📍 {stats.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={ClipboardList} label="Total Requests" value={stats?.totalRequests} color="bg-blue-50 text-blue-600" />
        <StatCard icon={AlertTriangle} label="Pending Requests" value={stats?.pendingRequests} color="bg-amber-50 text-amber-600" />
        <StatCard icon={Droplets} label="Active (Approved)" value={stats?.activeRequests} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={CheckCircle} label="Completed" value={stats?.completedRequests} color="bg-green-50 text-green-600" />
        <StatCard icon={XCircle} label="Cancelled" value={stats?.cancelledRequests} color="bg-slate-100 text-slate-500" />
        <StatCard icon={AlertTriangle} label="Emergency Requests" value={stats?.emergencyRequests} color="bg-red-50 text-red-600" />
      </div>

      {/* Bottom Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User2 size={18} className="text-red-500" /> Patient Profile Summary
          </h3>
          <div className="space-y-3">
            {[
              ["Name", stats?.fullName],
              ["Blood Group", stats?.bloodGroup ? BLOOD_GROUPS[stats.bloodGroup] : "—"],
              ["Hospital", stats?.hospitalName],
              ["Doctor", stats?.doctorName],
              ["City", stats?.city],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-semibold text-slate-700">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Last Request Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-red-500" /> Recent Activity
          </h3>
          {stats?.lastRequestDate ? (
            <div className="bg-slate-50 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">Last Request Date</span>
              <span className="font-bold text-red-600">{stats.lastRequestDate}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <ClipboardList size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">No blood requests made yet.</p>
              <p className="text-xs mt-1">Use "Request Blood" to submit your first request.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
