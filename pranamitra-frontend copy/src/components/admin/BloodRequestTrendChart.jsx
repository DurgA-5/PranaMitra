import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import bloodRequestService from "../../services/bloodRequestService";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function BloodRequestTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await bloodRequestService.getAllRequests();
        const list = Array.isArray(response) ? response : response?.data ?? [];

        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            monthName: monthNames[d.getMonth()],
            year: d.getFullYear(),
            monthIndex: d.getMonth(),
            requests: 0,
          });
        }

        list.forEach((req) => {
          if (req.createdAt) {
            const date = new Date(req.createdAt);
            const rMonth = date.getMonth();
            const rYear = date.getFullYear();

            const match = last6Months.find(
              (m) => m.monthIndex === rMonth && m.year === rYear
            );
            if (match) {
              match.requests += 1;
            }
          }
        });

        const chartData = last6Months.map((m) => ({
          month: `${m.monthName} ${m.year.toString().substring(2)}`,
          requests: m.requests,
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to calculate blood requests trend data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[260px] flex items-center justify-center animate-pulse text-slate-400">
        Loading Request Trends Chart...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow select-none">
      <h2 className="text-sm font-bold mb-6 text-slate-800 tracking-tight">
        Blood Request Trends (Monthly Volume)
      </h2>

      <ResponsiveContainer width="100%" height={170}>
        <LineChart data={data}>
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
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#fff", strokeWidth: 2, fill: "#f97316" }}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#f97316" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BloodRequestTrendChart;
