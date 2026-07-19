import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ClipboardList, Search, X, Eye, XCircle, ChevronRight, RefreshCw
} from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";
import EmptyState from "../../components/common/EmptyState";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const STATUS_BADGE = {
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED:  "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  REJECTED:  "bg-red-100 text-red-700 border-red-200",
};

const PRIORITY_BADGE = {
  LOW:    "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH:   "bg-red-100 text-red-700 border-red-200",
};

const BLOOD_GROUPS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

function MyRequests() {
  const userId = getUserId();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedReq, setSelectedReq] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await patientPortalService.getMyBloodRequests(userId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blood requests.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchStatus = filterStatus === "ALL" || r.requestStatus === filterStatus;
      const matchSearch = !search ||
        (r.requestNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.bloodGroup ?? "").toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [requests, filterStatus, search]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      setCancelling(true);
      await patientPortalService.cancelBloodRequest(userId, cancelTarget.id);
      toast.success("Blood request cancelled successfully.");
      setCancelTarget(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel request.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-red-500" size={24} /> My Blood Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track all your blood requests and their current status.</p>
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-slate-200 rounded-xl px-3 bg-slate-50">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by request # or blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-2 bg-transparent text-sm outline-none text-slate-700"
          />
          {search && <button onClick={() => setSearch("")}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No Requests Found" description="No blood requests match your current filters." icon={ClipboardList} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Request #", "Blood Group", "Units", "Priority", "Status", "Required Date", "Created", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-600 font-semibold whitespace-nowrap">{req.requestNumber}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 font-bold text-xs px-2.5 py-1 rounded-lg border border-red-100">
                        🩸 {BLOOD_GROUPS[req.bloodGroup] ?? req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{req.unitsRequired}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${PRIORITY_BADGE[req.emergencyLevel] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {req.emergencyLevel ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${STATUS_BADGE[req.requestStatus] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {req.requestStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{req.requiredDate}</td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">{req.createdAt?.split("T")[0]}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <Eye size={13} /> View
                        </button>
                        {req.requestStatus === "PENDING" && (
                          <button
                            onClick={() => setCancelTarget(req)}
                            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition"
                          >
                            <XCircle size={13} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ChevronRight size={18} className="text-red-500" /> Request Details
              </h3>
              <button onClick={() => setSelectedReq(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {[
                ["Request Number", selectedReq.requestNumber],
                ["Blood Group", BLOOD_GROUPS[selectedReq.bloodGroup] ?? selectedReq.bloodGroup],
                ["Units Required", selectedReq.unitsRequired],
                ["Priority", selectedReq.emergencyLevel],
                ["Status", selectedReq.requestStatus],
                ["Required Date", selectedReq.requiredDate],
                ["Remarks", selectedReq.remarks || "—"],
                ["Created", selectedReq.createdAt?.split("T")[0]],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center bg-slate-50 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-semibold text-slate-700">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-5 pt-0">
              <button onClick={() => setSelectedReq(null)} className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-2.5 text-sm font-semibold transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!cancelTarget}
        title="Cancel Blood Request"
        message={`Are you sure you want to cancel request ${cancelTarget?.requestNumber}? This action cannot be undone.`}
        confirmText={cancelling ? "Cancelling..." : "Cancel Request"}
        cancelText="Keep Request"
        onConfirm={handleCancel}
        onClose={() => setCancelTarget(null)}
        type="danger"
      />
    </div>
  );
}

export default MyRequests;
