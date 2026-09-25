import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import studentDonorService from "../../services/studentDonorService";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function DonorRegistrationTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await studentDonorService.getAllDonors();
        const list = Array.isArray(response) ? response : response?.data ?? [];

        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            monthName: monthNames[d.getMonth()],
            year: d.getFullYear(),
            monthIndex: d.getMonth(),
            registrations: 0,
          });
        }

        list.forEach((donor) => {
          if (donor.createdAt) {
            const date = new Date(donor.createdAt);
            const rMonth = date.getMonth();
            const rYear = date.getFullYear();

            const match = last6Months.find(
              (m) => m.monthIndex === rMonth && m.year === rYear
            );
            if (match) {
              match.registrations += 1;
            }
          }
        });

        const chartData = last6Months.map((m) => ({
          month: `${m.monthName} ${m.year.toString().substring(2)}`,
          registrations: m.registrations,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to calculate donor registration trend data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[260px] flex items-center justify-center animate-pulse text-slate-400">
        Loading Registrations Trends Chart...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow select-none">
      <h2 className="text-sm font-bold mb-6 text-slate-800 tracking-tight">
        Donor Registration Trend (Monthly Sign-ups)
      </h2>

      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          />
          <Area
            type="monotone"
            dataKey="registrations"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorReg)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonorRegistrationTrendChart;
