import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import bloodRequestService from "../../services/bloodRequestService";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function DonationChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await bloodRequestService.getAllRequests();
        const list = Array.isArray(response) ? response : response?.data ?? [];

        // Initialize last 6 months list dynamically
        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            monthName: monthNames[d.getMonth()],
            year: d.getFullYear(),
            monthIndex: d.getMonth(),
            donations: 0,
          });
        }

        // Aggregate units for completed requests matching those months
        list.forEach((req) => {
          if (req.requestStatus === "COMPLETED" && req.requiredDate) {
            const date = new Date(req.requiredDate);
            const rMonth = date.getMonth();
            const rYear = date.getFullYear();

            const match = last6Months.find(
              (m) => m.monthIndex === rMonth && m.year === rYear
            );
            if (match) {
              match.donations += req.unitsRequired || 0;
            }
          }
        });

        const chartData = last6Months.map((m) => ({
          month: `${m.monthName} ${m.year.toString().substring(2)}`,
          donations: m.donations,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to calculate monthly donations chart data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[400px] flex items-center justify-center animate-pulse text-slate-400">
        Loading Monthly Blood Donations Chart...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow select-none">
      <h2 className="text-base font-bold mb-6 text-slate-800 tracking-tight">
        Monthly Blood Donations (Fulfilled Units)
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} />
          <Tooltip
            cursor={{ fill: "#f8fafc", radius: 8 }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #f1f5f9",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          />
          <Bar
            dataKey="donations"
            fill="url(#colorDonations)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DonationChart;