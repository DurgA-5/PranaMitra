import { useEffect, useState } from "react";
import DonationChart from "../../components/admin/DonationChart";
import reportsService from "../../services/reportsService";
import dashboardService from "../../services/dashboardService";

import { toast } from "react-toastify";

function Reports() {
  const [stats, setStats] = useState(null);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);
  const [emergencyLevels, setEmergencyLevels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        dashboardStats,
        bgStats,
        reqStatusStats,
        emergStats,
        cityStats,
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        reportsService.getBloodGroups(),
        reportsService.getRequestStatus(),
        reportsService.getEmergencyLevel(),
        reportsService.getCities(),
      ]);

      setStats(dashboardStats);
      setBloodGroups(Array.isArray(bgStats) ? bgStats : bgStats?.data ?? []);
      setRequestStatus(Array.isArray(reqStatusStats) ? reqStatusStats : reqStatusStats?.data ?? []);
      setEmergencyLevels(Array.isArray(emergStats) ? emergStats : emergStats?.data ?? []);
      setCities(Array.isArray(cityStats) ? cityStats : cityStats?.data ?? []);
    } catch (error) {
      console.error("Failed to load reports data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatEnum = (val) => {
    if (!val) return "-";
    return val.replace(/_/g, " ");
  };

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

  const handleExportCSV = () => {
    if (bloodGroups.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Metric,Value\n";

    // Add Blood Groups
    bloodGroups.forEach((g) => {
      csvContent += `Blood Group,${formatBloodGroup(g.bloodGroup)},${g.totalDonors}\n`;
    });

    // Add Request Statuses
    requestStatus.forEach((s) => {
      csvContent += `Request Status,${formatEnum(s.requestStatus)},${s.totalRequests}\n`;
    });

    // Add Emergency Levels
    emergencyLevels.forEach((e) => {
      csvContent += `Emergency Level,${formatEnum(e.emergencyLevel)},${e.totalRequests}\n`;
    });

    // Add Cities
    cities.forEach((c) => {
      csvContent += `City,${c.city},${c.totalDonors}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pranamitra_analytics_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 animate-pulse">
        Loading system reports and analytics...
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Registered Donors",
      value: stats?.totalStudentDonors ?? 0,
      color: "text-red-600",
    },
    {
      title: "Blood Requests",
      value: stats?.totalBloodRequests ?? 0,
      color: "text-orange-600",
    },
    {
      title: "Active Blood Banks",
      value: stats?.totalBloodBanks ?? 0,
      color: "text-blue-600",
    },
    {
      title: "Completed Requests",
      value: stats?.completedRequests ?? 0,
      color: "text-green-600",
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="mt-2 text-gray-500">System insights and donation statistics.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Export CSV / Excel
          </button>

          <button
            type="button"
            onClick={handlePrintPDF}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Print Report / PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {summaryCards.map((item) => (
          <div key={item.title} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <p className="text-slate-500 text-sm font-medium">{item.title}</p>
            <h2 className={`text-3xl font-bold mt-3 ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Donation Chart */}
        <div className="lg:col-span-2 no-print">
          <DonationChart />
        </div>

        {/* Cities Statistics */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3">
            Top Cities by Donors
          </h3>
          <div className="overflow-y-auto max-h-[300px] space-y-3 pr-1">
            {cities.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No data</p>
            ) : (
              cities.map((item) => (
                <div key={item.city} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700">{item.city}</span>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                    {item.totalDonors} Donors
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-6 md:grid-cols-3 mt-8">
        {/* Blood Groups */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3">
            Blood Group Distribution
          </h3>
          <div className="space-y-3">
            {bloodGroups.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No data</p>
            ) : (
              bloodGroups.map((item) => (
                <div key={item.bloodGroup} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-red-600">{formatBloodGroup(item.bloodGroup)}</span>
                  <span className="text-slate-800 font-bold">{item.totalDonors} Donors</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Request Statuses */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3">
            Requests Status Statistics
          </h3>
          <div className="space-y-3">
            {requestStatus.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No data</p>
            ) : (
              requestStatus.map((item) => (
                <div key={item.requestStatus} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700 capitalize">
                    {formatEnum(item.requestStatus).toLowerCase()}
                  </span>
                  <span className="text-slate-800 font-bold">{item.totalRequests} Requests</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Emergency Levels */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3">
            Requests by Emergency Level
          </h3>
          <div className="space-y-3">
            {emergencyLevels.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No data</p>
            ) : (
              emergencyLevels.map((item) => (
                <div key={item.emergencyLevel} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700 capitalize">
                    {formatEnum(item.emergencyLevel).toLowerCase()}
                  </span>
                  <span className="text-slate-800 font-bold">{item.totalRequests} Requests</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;