import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { History, Calendar, RefreshCw, Heart, User, ShieldCheck } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";
import EmptyState from "../../components/common/EmptyState";

function DonationHistory() {
  const userId = getUserId();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnonymous, setShowAnonymous] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getDonationHistory(userId);
      setHistory(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch donation history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <History className="text-red-500" size={26} /> My Donation History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Complete record of your past blood donations and life-saving contributions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAnonymous(!showAnonymous)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              showAnonymous
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {showAnonymous ? "Showing Anonymous Recipients" : "Toggle Recipient Visibility"}
          </button>

          <button
            type="button"
            onClick={fetchHistory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Main History Table */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-3 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <EmptyState
          title="No Donation History Found"
          description="You haven't completed any blood donations yet. Accept matching emergency requests to start saving lives!"
          icon={Heart}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Donation Date</th>
                  <th className="px-6 py-4">Hospital Name</th>
                  <th className="px-6 py-4 text-center">Blood Group</th>
                  <th className="px-6 py-4 text-center">Units Donated</th>
                  <th className="px-6 py-4">Recipient Name</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {item.donationDate || "Recently Completed"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.hospitalName || "General City Hospital"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-extrabold border border-red-100">
                        🩸 {formatBloodGroup(item.bloodGroup)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">
                      {item.units || 1} Unit(s)
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">
                          {showAnonymous ? "Anonymous Patient" : item.patientName || "Emergency Patient"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                          item.status === "DONATED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <ShieldCheck size={13} /> {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonationHistory;
