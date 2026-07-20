import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Activity, ShieldCheck, ShieldAlert, Clock, Calendar, CheckCircle2, AlertTriangle
} from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

function Availability() {
  const userId = getUserId();
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [availabilityState, setAvailabilityState] = useState("AVAILABLE"); // AVAILABLE, UNAVAILABLE, BUSY

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getDashboardData(userId);
      setDonorProfile(data);
      if (data?.availableToDonate === true) {
        setAvailabilityState("AVAILABLE");
      } else {
        setAvailabilityState("UNAVAILABLE");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load availability info.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateChange = async (newState) => {
    if (updating) return;
    try {
      setUpdating(true);
      const isAvailable = newState === "AVAILABLE";
      await donorPortalService.toggleAvailability(userId, isAvailable);
      setAvailabilityState(newState);
      setDonorProfile((prev) => ({ ...prev, availableToDonate: isAvailable }));
      toast.success(`Availability status updated to: ${newState.replace("_", " ")}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-3xl mx-auto">
        <div className="h-32 bg-white rounded-2xl"></div>
        <div className="h-64 bg-white rounded-2xl"></div>
      </div>
    );
  }

  const lastDonation = donorProfile?.lastDonationDate || "Never Donated";
  const nextEligible = donorProfile?.nextEligibleDonationDate || "Eligible Now";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Activity className="text-red-500" size={26} /> My Availability Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your availability to accept emergency blood request assignments from hospitals.
        </p>
      </div>

      {/* Current Status Badge Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${
              availabilityState === "AVAILABLE"
                ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                : availabilityState === "BUSY"
                ? "bg-amber-500 shadow-lg shadow-amber-500/20"
                : "bg-slate-400 shadow-lg shadow-slate-400/20"
            }`}
          >
            {availabilityState === "AVAILABLE" ? (
              <ShieldCheck size={28} />
            ) : availabilityState === "BUSY" ? (
              <AlertTriangle size={28} />
            ) : (
              <ShieldAlert size={28} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Availability Badge</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-0.5">
              {availabilityState === "AVAILABLE"
                ? "Available to Donate"
                : availabilityState === "BUSY"
                ? "Temporarily Busy"
                : "Currently Unavailable"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {availabilityState === "AVAILABLE"
                ? "Your profile is active and visible for emergency blood matches."
                : availabilityState === "BUSY"
                ? "You will be temporarily snoozed from immediate emergency callouts."
                : "Your profile will not appear in emergency request matching searches."}
            </p>
          </div>
        </div>

        <span
          className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase border ${
            availabilityState === "AVAILABLE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse"
              : availabilityState === "BUSY"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          ● {availabilityState}
        </span>
      </div>

      {/* Select Availability Option Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Set Your Current Availability Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Available */}
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStateChange("AVAILABLE")}
            className={`p-5 rounded-2xl border text-left transition-all relative ${
              availabilityState === "AVAILABLE"
                ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-md"
                : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
            }`}
          >
            {availabilityState === "AVAILABLE" && (
              <CheckCircle2 className="absolute top-4 right-4 text-emerald-600" size={20} />
            )}
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 font-bold">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Available</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ready and willing to donate blood when an emergency request matches your group.
            </p>
          </button>

          {/* Unavailable */}
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStateChange("UNAVAILABLE")}
            className={`p-5 rounded-2xl border text-left transition-all relative ${
              availabilityState === "UNAVAILABLE"
                ? "border-slate-600 bg-slate-100/80 ring-2 ring-slate-400/20 shadow-md"
                : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            {availabilityState === "UNAVAILABLE" && (
              <CheckCircle2 className="absolute top-4 right-4 text-slate-700" size={20} />
            )}
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-3 font-bold">
              <ShieldAlert size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Unavailable</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pause matching notifications due to medical reasons, travel, or personal preference.
            </p>
          </button>

          {/* Temporarily Busy */}
          <button
            type="button"
            disabled={updating}
            onClick={() => handleStateChange("BUSY")}
            className={`p-5 rounded-2xl border text-left transition-all relative ${
              availabilityState === "BUSY"
                ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-md"
                : "border-slate-200 hover:border-amber-300 hover:bg-slate-50"
            }`}
          >
            {availabilityState === "BUSY" && (
              <CheckCircle2 className="absolute top-4 right-4 text-amber-600" size={20} />
            )}
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 font-bold">
              <Clock size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Temporarily Busy</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Snooze emergency matching during exams, work shifts, or short term unavailability.
            </p>
          </button>
        </div>
      </div>

      {/* Donation Eligibility Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="text-red-500" size={20} /> Donation Eligibility Tracker
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Donation Date</span>
              <h4 className="text-xl font-bold text-slate-800 mt-1">{lastDonation}</h4>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600">
              <Calendar size={22} />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Eligible Date</span>
              <h4 className="text-xl font-bold text-red-600 mt-1">{nextEligible}</h4>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <Clock size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Availability;
