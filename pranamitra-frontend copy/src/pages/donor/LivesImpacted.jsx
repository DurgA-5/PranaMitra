import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Heart, Sparkles, Users, Droplets, Calendar, ShieldCheck, Award, Clock
} from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

function LivesImpacted() {
  const userId = getUserId();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getDashboardData(userId);
      setStats(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load impact stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
        <div className="h-44 bg-white rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalDonations = stats?.totalDonations || 0;
  const patientsHelped = totalDonations > 0 ? totalDonations * 3 : 0;
  const unitsDonated = totalDonations;
  const lastDonation = stats?.lastDonationDate || "Never Donated";
  const nextEligible = stats?.nextEligibleDonationDate || "Eligible Now";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl shadow-red-600/15 relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-20px] text-white/10 pointer-events-none">
          <Sparkles size={220} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-white mb-3">
            <Award size={14} className="text-amber-300 fill-amber-300" /> Lifesaver Recognition
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Life-Saving Impact</h1>
          <p className="text-red-100 text-sm sm:text-base mt-2 leading-relaxed">
            Every blood donation can save up to 3 patient lives in critical surgeries, trauma emergencies, and cancer treatments.
          </p>
        </div>
      </div>

      {/* 5 Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Patients Helped */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-red-200 transition">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl w-fit mb-2">
            <Users size={22} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Patients Helped</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{patientsHelped}</h3>
          </div>
        </div>

        {/* Total Donations */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-rose-200 transition">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-fit mb-2">
            <Heart size={22} className="fill-rose-600" />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Total Donations</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalDonations}</h3>
          </div>
        </div>

        {/* Units Donated */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-amber-200 transition">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-2">
            <Droplets size={22} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Units Donated</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{unitsDonated}</h3>
          </div>
        </div>

        {/* Last Donation */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-blue-200 transition">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-2">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Last Donation</span>
            <h3 className="text-sm font-bold text-slate-800 mt-1">{lastDonation}</h3>
          </div>
        </div>

        {/* Next Eligible Date */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:border-emerald-200 transition">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-2">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider block">Next Eligible</span>
            <h3 className="text-sm font-bold text-emerald-600 mt-1">{nextEligible}</h3>
          </div>
        </div>
      </div>

      {/* Visual Donation Timeline & Badges */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="text-red-500" size={20} /> Lifesaver Journey & Milestones
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-red-100">
          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-red-50">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">First Donation Milestone</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Registered on PranaMitra as a verified student donor.
              </p>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-red-50">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Emergency Matching Active</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Enabled availability toggle for instant hospital callouts.
              </p>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-50">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Impact Goal: 10 Lives Saved</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep your profile available to reach the Bronze Lifesaver Badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LivesImpacted;
