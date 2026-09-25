import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Calendar, User, Heart, ToggleLeft, ToggleRight, Sparkles, Activity,
  Droplets, CheckSquare, Clock, ShieldCheck, Flame
} from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

function Dashboard() {
  const userId = getUserId();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getDashboardData(userId);
      setStats(data);
    } catch (error) {
      console.error("Failed to load donor dashboard", error);
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleAvailability = async () => {
    if (toggling) return;
    try {
      setToggling(true);
      const nextStatus = !stats?.availableToDonate;
      await donorPortalService.toggleAvailability(userId, nextStatus);
      setStats((prev) => ({ ...prev, availableToDonate: nextStatus }));
      toast.success(
        nextStatus
          ? "You are now set as Available to Donate!"
          : "You are now set as Unavailable to Donate."
      );
    } catch (error) {
      console.error("Failed to toggle availability", error);
      toast.error("Failed to update availability status.");
    } finally {
      setToggling(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-white rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const formatBloodGroup = (bg) => {
    if (!bg) return "-";
    return bg
      .replace("A_POSITIVE", "A+")
      .replace("A_NEGATIVE", "A-")
      .replace("B_POSITIVE", "B+")
      .replace("B_NEGATIVE", "B-")
      .replace("AB_POSITIVE", "AB+")
      .replace("AB_NEGATIVE", "AB-")
      .replace("O_POSITIVE", "O+")
      .replace("O_NEGATIVE", "O-");
  };

  const totalDonations = stats?.totalDonations || 0;
  const livesImpacted = totalDonations * 3;
  const requestsRaised = stats?.requestsRaised || 0;
  const matchingRequests = stats?.pendingRequests || 0;
  const acceptedRequests = stats?.acceptedRequests || 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Donor Coordination Center <Sparkles className="text-red-500 animate-pulse" size={24} />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time emergency blood donation tracking and recipient coordination.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100">
          <span className="text-xs font-semibold text-slate-500">Eligibility Status:</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck size={14} /> Ready to Save Lives
          </span>
        </div>
      </div>

      {/* Top Banner & Availability Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl shadow-red-600/10 flex flex-col justify-between h-52 lg:col-span-2 relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] text-white/10 pointer-events-none">
            <Heart size={180} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white mb-3">
              <Flame size={14} className="text-amber-300 fill-amber-300" /> Active Emergency Lifesaver
            </div>
            <h2 className="text-2xl font-bold">Welcome Back, {stats?.fullName || "Donor"}!</h2>
            <p className="text-red-100 text-sm mt-2 leading-relaxed max-w-xl">
              Keeping your donor availability active allows emergency blood desks to contact you instantly when compatible patients require urgent transfusions.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4 text-xs font-bold text-white/90">
            <span className="bg-white/10 px-3 py-1 rounded-lg">Student ID: {stats?.studentId || "STD-8842"}</span>
            <span>•</span>
            <span className="bg-white/10 px-3 py-1 rounded-lg">Blood Group: {formatBloodGroup(stats?.bloodGroup)}</span>
          </div>
        </div>

        {/* Availability Toggle Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-52">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-red-500" /> Availability Status
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Toggle your availability state for emergency hospital matching searches.
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className={`text-sm font-bold block ${stats?.availableToDonate ? "text-emerald-600" : "text-slate-500"}`}>
                {stats?.availableToDonate ? "Active & Available" : "Currently Unavailable"}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {stats?.availableToDonate ? "Visible to Emergency Desks" : "Hidden from Matches"}
              </span>
            </div>

            <button
              type="button"
              disabled={toggling}
              onClick={handleToggleAvailability}
              className="text-slate-600 hover:text-red-600 focus:outline-none transition-transform active:scale-95"
              aria-label="Toggle availability"
            >
              {stats?.availableToDonate ? (
                <ToggleRight className="text-emerald-500 hover:text-emerald-600 cursor-pointer" size={44} />
              ) : (
                <ToggleLeft className="text-slate-300 hover:text-slate-400 cursor-pointer" size={44} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Donations */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-red-200 transition">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl w-fit mb-3">
            <Heart size={20} className="fill-red-600" />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Donations</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{totalDonations}</h3>
        </div>

        {/* Lives Impacted */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-rose-200 transition">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-fit mb-3">
            <Sparkles size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Lives Impacted</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{livesImpacted}</h3>
        </div>

        {/* Blood Requests Raised */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-blue-200 transition">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3">
            <Droplets size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Requests Raised</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{requestsRaised}</h3>
        </div>

        {/* Matching Requests */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-amber-200 transition">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3">
            <User size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Matching Requests</p>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{matchingRequests}</h3>
        </div>

        {/* Accepted Requests */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-emerald-200 transition">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3">
            <CheckSquare size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Accepted Requests</p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{acceptedRequests}</h3>
        </div>

        {/* Availability Status */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-indigo-200 transition">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3">
            <Activity size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Availability</p>
          <h3 className="text-lg font-bold text-slate-800 mt-1">
            {stats?.availableToDonate ? "Available" : "Unavailable"}
          </h3>
        </div>

        {/* Next Eligible Donation */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-purple-200 transition col-span-2">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3">
            <Calendar size={20} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Next Eligible Donation</p>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-xl font-bold text-red-600">
              {stats?.nextEligibleDonationDate || "Eligible Now"}
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              Last: {stats?.lastDonationDate || "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-slate-400" /> Recent Activities
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Availability Updated",
              desc: `Your availability status is currently set as ${stats?.availableToDonate ? "Available" : "Unavailable"}.`,
              time: "Just now",
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              title: "Emergency Match Scan",
              desc: `${matchingRequests} matching emergency requests found matching blood group ${formatBloodGroup(stats?.bloodGroup)}.`,
              time: "10 mins ago",
              color: "bg-amber-50 text-amber-600",
            },
            {
              title: "Donation Portal Initialized",
              desc: "Your emergency coordination account is active and verified.",
              time: "Today",
              color: "bg-blue-50 text-blue-600",
            },
          ].map((act, i) => (
            <div key={i} className="flex items-start gap-4 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className={`p-2 rounded-lg text-xs font-bold ${act.color}`}>
                <Activity size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{act.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
