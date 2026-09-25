import { useEffect, useState } from "react";
import DashboardStats from "../../components/admin/DashboardStats";
import RecentRequests from "../../components/admin/RecentRequests";
import RecentDonors from "../../components/admin/RecentDonors";
import RecentPatients from "../../components/admin/RecentPatients";
import RecentBloodBanks from "../../components/admin/RecentBloodBanks";
import BloodInventory from "../../components/admin/BloodInventory";
import EmergencyAlerts from "../../components/admin/EmergencyAlerts";
import DonationChart from "../../components/admin/DonationChart";
import BloodRequestTrendChart from "../../components/admin/BloodRequestTrendChart";
import DonorRegistrationTrendChart from "../../components/admin/DonorRegistrationTrendChart";
import QuickActions from "../../components/admin/QuickActions";

function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 30000); // Auto refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome to the PranaMitra Blood Management System
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          Refresh Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <DashboardStats key={`stats-${refreshKey}`} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <DonationChart key={`chart-donations-${refreshKey}`} />
        </div>
        <div>
          <BloodInventory key={`inventory-${refreshKey}`} />
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <BloodRequestTrendChart key={`trend-requests-${refreshKey}`} />
        <DonorRegistrationTrendChart key={`trend-donors-${refreshKey}`} />
      </div>

      {/* Actions and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div>
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <EmergencyAlerts key={`alerts-${refreshKey}`} />
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentDonors key={`recent-donors-${refreshKey}`} />
        <RecentPatients key={`recent-patients-${refreshKey}`} />
        <RecentRequests key={`recent-requests-${refreshKey}`} />
        <RecentBloodBanks key={`recent-banks-${refreshKey}`} />
      </div>
    </>
  );
}

export default Dashboard;