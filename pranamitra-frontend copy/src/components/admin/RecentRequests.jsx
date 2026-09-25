import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ClipboardList } from "lucide-react";
import bloodRequestService from "../../services/bloodRequestService";

function RecentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const response = await bloodRequestService.getAllRequests();
        const list = Array.isArray(response) ? response : response?.data ?? [];
        const sorted = [...list].sort((a, b) => b.id - a.id).slice(0, 5);
        setRequests(sorted);
      } catch (error) {
        console.error("Failed to load recent requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "APPROVED":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border border-red-200 font-bold";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border border-orange-200 font-semibold";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-100";
    }
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[400px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="space-y-3 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[400px] flex flex-col justify-between hover:shadow-md transition-shadow select-none">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Blood Requests</h2>
            <span className="bg-pink-50 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-100">
              {requests.length} Requests
            </span>
          </div>

          <button
            onClick={() => navigate("/admin/requests")}
            className="text-xs font-semibold text-slate-500 hover:text-pink-600 transition"
          >
            View All
          </button>
        </div>

        {/* Scrollable Table Area / Empty State */}
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-100 border-dashed rounded-xl flex-1">
            <ClipboardList className="text-slate-300 mb-2 animate-bounce" size={36} />
            <h3 className="text-sm font-bold text-slate-800">No Blood Requests Yet</h3>
            <p className="text-slate-400 text-xs mt-1">Create a blood request to see data here.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto rounded-xl border border-slate-100 scrollbar-thin min-h-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 z-10">
                <tr>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4 text-center">Group</th>
                  <th className="py-3 px-4 text-center">Units</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Required Date</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {requests.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-700 whitespace-nowrap">
                      {item.patientName || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded text-[10px] border border-red-100 inline-block">
                        {formatBloodGroup(item.bloodGroup)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {item.unitsRequired}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(item.emergencyLevel)}`}>
                        {item.emergencyLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(item.requestStatus)}`}>
                        {item.requestStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {item.requiredDate || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/requests`)}
                        className="text-slate-400 hover:text-pink-600 p-1 rounded-lg hover:bg-slate-100 transition inline-flex items-center"
                        title="View request details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentRequests;