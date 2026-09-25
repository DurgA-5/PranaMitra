import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import reportsService from "../../services/reportsService";

const COLORS = {
  "A_POSITIVE": "#ef4444",
  "A_NEGATIVE": "#b91c1c",
  "B_POSITIVE": "#f97316",
  "B_NEGATIVE": "#c2410c",
  "AB_POSITIVE": "#ec4899",
  "AB_NEGATIVE": "#be185d",
  "O_POSITIVE": "#10b981",
  "O_NEGATIVE": "#047857"
};

function BloodInventory() {
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        setLoading(true);
        const response = await reportsService.getBloodGroups();
        const list = Array.isArray(response) ? response : response?.data ?? [];
        setDistribution(list);
      } catch (error) {
        console.error("Failed to load blood inventory stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistribution();
  }, []);

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

  const groupOrder = [
    "A_POSITIVE", "A_NEGATIVE",
    "B_POSITIVE", "B_NEGATIVE",
    "AB_POSITIVE", "AB_NEGATIVE",
    "O_POSITIVE", "O_NEGATIVE"
  ];

  const sortedDistribution = [...distribution].sort((a, b) => {
    return groupOrder.indexOf(a.bloodGroup) - groupOrder.indexOf(b.bloodGroup);
  });

  const chartData = sortedDistribution.map(item => ({
    name: formatBloodGroup(item.bloodGroup),
    value: item.totalDonors,
    key: item.bloodGroup
  })).filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[400px] flex flex-col justify-between animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="w-40 h-40 rounded-full bg-slate-100 mx-auto mt-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-full select-none hover:shadow-md transition-shadow">
      <div>
        <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">
          Blood Group Distribution
        </h2>

        {chartData.length > 0 && (
          <div className="h-44 w-full mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[entry.key] || "#cbd5e1"} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {sortedDistribution.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
              No inventory statistics found.
            </div>
          ) : (
            sortedDistribution.map((item) => (
              <div
                key={item.bloodGroup}
                className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 hover:shadow-sm transition"
              >
                <span className="font-bold text-slate-600 text-xs flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[item.bloodGroup] || "#cbd5e1" }}
                  />
                  {formatBloodGroup(item.bloodGroup)}
                </span>

                <span className="font-bold text-slate-800 text-xs">
                  {item.totalDonors}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default BloodInventory;