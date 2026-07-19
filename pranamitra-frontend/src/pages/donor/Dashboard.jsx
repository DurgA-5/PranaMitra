import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Calendar, User, Heart, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
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
    }, 30000); // 30s auto refresh
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleAvailability = async () => {
    if (toggling) return;
    try {
      setToggling(true);
      const nextStatus = !stats.availableToDonate;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-48 bg-white rounded-2xl md:col-span-3"></div>
        <div className="h-32 bg-white rounded-2xl"></div>
        <div className="h-32 bg-white rounded-2xl"></div>
        <div className="h-32 bg-white rounded-2xl"></div>
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

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          Donor Portal <Sparkles className="text-red-500 animate-pulse" size={24} />
        </h1>
        <p className="text-gray-500 mt-2">Manage your donation status and matching requests.</p>
      </div>

      {/* Top Grid: Welcome & Eligibility & Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between h-48 lg:col-span-2">
          <div>
            <h2 className="text-2xl font-bold">Welcome Back, {stats?.fullName}!</h2>
            <p className="text-red-100 text-sm mt-2 leading-relaxed">
              Your contribution is saving lives. Keeping your availability toggled on ensures hospitals can contact you in emergencies.
            </p>
          </div>
          <div className="flex gap-4 text-xs font-semibold text-red-50">
            <span>Student ID: {stats?.studentId}</span>
            <span>•</span>
            <span>Blood Group: {formatBloodGroup(stats?.bloodGroup)}</span>
          </div>
        </div>

        {/* Availability Toggle Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-48">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Availability Status</h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Toggle this status to show or hide your profile from emergency hospital matching searches.
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className={`text-sm font-bold ${stats?.availableToDonate ? "text-emerald-600" : "text-slate-400"}`}>
              {stats?.availableToDonate ? "Active & Available" : "Currently Unavailable"}
            </span>

            <button
              type="button"
              disabled={toggling}
              onClick={handleToggleAvailability}
              className="text-slate-600 hover:text-red-600 focus:outline-none transition-transform active:scale-95"
              aria-label="Toggle availability"
            >
              {stats?.availableToDonate ? (
                <ToggleRight className="text-emerald-500 hover:text-emerald-600 cursor-pointer" size={48} />
              ) : (
                <ToggleLeft className="text-slate-300 hover:text-slate-400 cursor-pointer" size={48} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3.5 bg-red-50 text-red-600 rounded-xl">
            <Heart size={24} className="fill-red-600" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Donations</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.totalDonations}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Accepted Requests</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.acceptedRequests}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <User size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Matches</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats?.pendingRequests}</h3>
          </div>
        </div>
      </div>

      {/* Next Eligible Donation Date Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Donation Eligibility Tracker</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Last Donation Date</span>
            <span className="font-bold text-slate-800">{stats?.lastDonationDate || "Never Donated"}</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Next Eligible Date</span>
            <span className="font-bold text-red-600">{stats?.nextEligibleDonationDate}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
