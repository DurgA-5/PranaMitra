import { useState, useEffect } from "react";
import authService from "../../services/authService";
import { Users, UserSquare2, FileHeart, Landmark, ShieldCheck } from "lucide-react";

// CountUp helper component for animated counters
function CountUp({ value }) {
  const [count, setCount] = useState(0);
  const duration = 1200; // ms

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }

    const stepTime = Math.max(Math.floor(duration / end), 12);
    const timer = setInterval(() => {
      start += Math.ceil(end / 40); // increment steps
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

function Statistics() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalPatients: 0,
    totalBloodRequests: 0,
    totalBloodBanks: 0,
    livesSaved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responseData = await authService.getStats();
        // Set stats or merge with defaults if any returns 0
        setStats({
          totalDonors: responseData?.totalDonors ?? 0,
          totalPatients: responseData?.totalPatients ?? 0,
          totalBloodRequests: responseData?.totalBloodRequests ?? 0,
          totalBloodBanks: responseData?.totalBloodBanks ?? 0,
          livesSaved: responseData?.livesSaved ?? 0,
        });
      } catch (err) {
        console.error("Failed to load statistics from backend:", err);
        setStats({
          totalDonors: 0,
          totalPatients: 0,
          totalBloodRequests: 0,
          totalBloodBanks: 0,
          livesSaved: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardList = [
    {
      icon: <Users className="text-red-600" size={26} />,
      label: "Total Donors",
      key: "totalDonors",
      suffix: "+",
    },
    {
      icon: <UserSquare2 className="text-rose-500" size={26} />,
      label: "Total Patients",
      key: "totalPatients",
      suffix: "",
    },
    {
      icon: <FileHeart className="text-amber-500" size={26} />,
      label: "Blood Requests",
      key: "totalBloodRequests",
      suffix: "",
    },
    {
      icon: <Landmark className="text-emerald-500" size={26} />,
      label: "Blood Banks",
      key: "totalBloodBanks",
      suffix: "",
    },
    {
      icon: <ShieldCheck className="text-red-600" size={26} />,
      label: "Lives Saved",
      key: "livesSaved",
      suffix: "+",
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-800/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-800/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500">
            Realtime Impact
          </h2>
          <p className="text-2xl md:text-3xl font-extrabold tracking-tight">
            PranaMitra Live Network Performance
          </p>
          <p className="text-sm text-slate-400 font-medium">
            Live counts showing active contributions across our blood sharing portal.
          </p>
        </div>

        {/* Counter Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cardList.map((card, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 flex flex-col justify-between items-center text-center shadow-md hover:border-red-500/30 transition-all duration-300"
            >
              <div className="p-3 bg-slate-700/50 rounded-xl mb-4 text-white shadow-inner">
                {card.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl lg:text-4xl font-extrabold text-white">
                  {!loading ? (
                    <CountUp value={stats[card.key]} />
                  ) : (
                    "0"
                  )}
                  {card.suffix}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-400">
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Statistics;
