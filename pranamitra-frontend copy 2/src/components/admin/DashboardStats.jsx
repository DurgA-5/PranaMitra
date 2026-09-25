import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  HeartPulse,
  Droplet,
  Building2,
  UserCheck,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Mail
} from "lucide-react";
import dashboardService from "../../services/dashboardService";

function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await dashboardService.getDashboardStats();
      setStats(response);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="w-8 h-8 rounded-xl bg-slate-200"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-1/3 mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-500 font-medium">
        No statistics available.
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Donors",
      value: stats.totalStudentDonors ?? 0,
      subtitle: "Registered Donors",
      icon: Users,
      bgIcon: "bg-red-50 text-red-600 border border-red-100",
      accent: "border-l-4 border-l-red-500",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients ?? 0,
      subtitle: "Registered Patients",
      icon: HeartPulse,
      bgIcon: "bg-orange-50 text-orange-600 border border-orange-100",
      accent: "border-l-4 border-l-orange-500",
    },
    {
      title: "Total Blood Requests",
      value: stats.totalBloodRequests ?? 0,
      subtitle: "Total Request Volume",
      icon: Droplet,
      bgIcon: "bg-pink-50 text-pink-600 border border-pink-100",
      accent: "border-l-4 border-l-pink-500",
    },
    {
      title: "Total Blood Banks",
      value: stats.totalBloodBanks ?? 0,
      subtitle: "Registered Facilities",
      icon: Building2,
      bgIcon: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      accent: "border-l-4 border-l-indigo-500",
    },
    {
      title: "Available Donors",
      value: stats.availableDonors ?? 0,
      subtitle: "Ready to Donate Now",
      icon: UserCheck,
      bgIcon: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      accent: "border-l-4 border-l-emerald-500",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests ?? 0,
      subtitle: "Awaiting Verification",
      icon: Clock,
      bgIcon: "bg-amber-50 text-amber-600 border border-amber-100",
      accent: "border-l-4 border-l-amber-500",
    },
    {
      title: "Emergency Requests",
      value: stats.emergencyRequests ?? 0,
      subtitle: "Critical / High Priority",
      icon: AlertOctagon,
      bgIcon: "bg-red-100 text-red-700 border border-red-200 animate-pulse",
      accent: "border-l-4 border-l-rose-600",
    },
    {
      title: "Completed Requests",
      value: stats.completedRequests ?? 0,
      subtitle: "Successfully Fulfilled",
      icon: CheckCircle2,
      bgIcon: "bg-green-50 text-green-600 border border-green-100",
      accent: "border-l-4 border-l-green-500",
    },
    {
      title: "New Contact Queries",
      value: stats.newContactQueries ?? 0,
      subtitle: "Unread Contact Enquiries",
      icon: Mail,
      bgIcon: "bg-blue-50 text-blue-600 border border-blue-100",
      accent: "border-l-4 border-l-blue-500",
      path: "/admin/contact-queries",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      {dashboardCards.map((card) => {
        const Icon = card.icon;
        const CardContent = (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{card.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-2.5">
                  {card.value}
                </h3>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bgIcon}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold mt-4">
              {card.subtitle}
            </p>
          </>
        );

        const cardClass = `bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${card.accent}`;

        if (card.path) {
          return (
            <Link key={card.title} to={card.path} className={cardClass}>
              {CardContent}
            </Link>
          );
        }

        return (
          <div key={card.title} className={cardClass}>
            {CardContent}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;