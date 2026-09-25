import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ClipboardList, Search, X, Eye, XCircle, RefreshCw, PhoneCall, UserCheck, MapPin, Building, Plus
} from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import donorPortalService from "../../services/donorPortalService";
import { getUserId, getRole } from "../../utils/token";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import PriorityBadge from "../../components/ui/PriorityBadge";
import RequestTimeline from "../../components/ui/RequestTimeline";

const STATUS_BADGE = {
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED:  "bg-blue-100 text-blue-700 border-blue-200 font-bold",
  COMPLETED: "bg-green-100 text-green-700 border-green-200 font-bold",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  REJECTED:  "bg-red-100 text-red-700 border-red-200",
};

const BLOOD_GROUPS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

function MyRequests() {
  const userId = getUserId();
  const userRole = getRole();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedReq, setSelectedReq] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = userRole === "DONOR"
        ? await donorPortalService.getMyBloodRequests(userId)
        : await patientPortalService.getMyBloodRequests(userId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load blood requests.");
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchStatus = filterStatus === "ALL" || r.requestStatus === filterStatus;
      const matchSearch = !search ||
        (r.requestNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.bloodGroup ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (BLOOD_GROUPS[r.bloodGroup] ?? "").toLowerCase().includes(search.toLowerCase());
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
      console.error("Error cancelling request:", err);
      toast.error(err.response?.data?.message || "Failed to cancel request.");
    } finally {
      setCancelling(false);
    }
  };

  const createRequestPath = userRole === "DONOR" ? "/donor/request-blood" : "/patient/request-blood";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
            <ClipboardList className="text-red-500" size={26} /> My Blood Requests & Matched Donors
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track live request timelines and immediately view assigned donor contact details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(createRequestPath)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition shrink-0"
          >
            <Plus size={16} /> Create Blood Request
          </button>
          <button
            onClick={fetchRequests}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm shrink-0"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-slate-200 rounded-xl px-3.5 bg-slate-50">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by request # or blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-2.5 bg-transparent text-sm outline-none text-slate-700"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 bg-slate-50 outline-none focus:border-red-500 transition font-semibold"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved / Matched</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Requests List or Empty State */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <ClipboardList size={32} />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-extrabold text-slate-800">No Blood Requests Found</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              {search || filterStatus !== "ALL"
                ? "No blood requests match your active search filters. Try clearing your filters or search term."
                : "You haven't submitted any emergency blood requests yet. Create a request to connect with verified student donors."}
            </p>
          </div>
          <button
            onClick={() => navigate(createRequestPath)}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition"
          >
            <Plus size={18} /> Create Blood Request
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold">
                  <th className="px-5 py-4">Request #</th>
                  <th className="px-5 py-4">Blood Group</th>
                  <th className="px-5 py-4 text-center">Units</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Required Date</th>
                  <th className="px-5 py-4">Created Date</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4 font-mono text-xs text-slate-600 font-bold whitespace-nowrap">
                      {req.requestNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 font-extrabold text-xs px-2.5 py-1 rounded-lg border border-red-100">
                        🩸 {BLOOD_GROUPS[req.bloodGroup] ?? req.bloodGroup}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center font-extrabold text-slate-800">{req.unitsRequired}</td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={req.emergencyLevel} size="sm" />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_BADGE[req.requestStatus] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        ● {req.requestStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap text-xs font-semibold">{req.requiredDate}</td>
                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-xs font-mono">{req.createdAt?.split("T")[0]}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 transition shadow-sm"
                        >
                          <Eye size={14} /> View & Donors
                        </button>
                        {(req.requestStatus === "PENDING" || req.requestStatus === "APPROVED") && (
                          <button
                            onClick={() => setCancelTarget(req)}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 transition"
                          >
                            <XCircle size={14} /> Cancel
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

      {/* Detailed Modal with Live Timeline & Matched Donors */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 block">{selectedReq.requestNumber}</span>
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  Emergency Request Live Overview
                </h3>
              </div>
              <button onClick={() => setSelectedReq(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Blood Group</span>
                  <span className="font-extrabold text-red-600 text-sm mt-0.5 block">
                    🩸 {BLOOD_GROUPS[selectedReq.bloodGroup] ?? selectedReq.bloodGroup}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Units</span>
                  <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                    {selectedReq.unitsRequired} Unit(s)
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Priority</span>
                  <div className="mt-0.5">
                    <PriorityBadge priority={selectedReq.emergencyLevel} size="sm" />
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Required Date</span>
                  <span className="font-bold text-slate-700 text-xs mt-1 block">
                    {selectedReq.requiredDate}
                  </span>
                </div>
              </div>

              {/* Matched Donors Section - Immediate Emergency Sharing */}
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                  <UserCheck className="text-emerald-600" size={18} /> Matched Emergency Donors (Immediate Sharing)
                </h4>

                {(!selectedReq.assignedDonors || selectedReq.assignedDonors.length === 0) ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center text-xs text-amber-800 font-medium">
                    {selectedReq.requestStatus === "PENDING"
                      ? "Emergency blood request is under review. Donors will be assigned immediately upon admin approval."
                      : "No matching registered donors currently assigned."}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedReq.assignedDonors.map((donor, i) => (
                      <div key={donor.id || i} className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h5 className="font-extrabold text-slate-800 text-sm">{donor.name || "Donor"}</h5>
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              🩸 {BLOOD_GROUPS[donor.bloodGroup] || donor.bloodGroup || "O+"}
                            </span>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 mb-3">
                            <p className="flex items-center gap-1 font-medium">
                              <Building size={13} className="text-slate-400" /> {donor.college || donor.city || "Medical Campus"}
                            </p>
                            <p className="flex items-center gap-1 font-bold text-emerald-700">
                              <MapPin size={13} /> {donor.distance || "3.2 km"} · <span className="uppercase">{donor.status || "AVAILABLE"}</span>
                            </p>
                          </div>
                        </div>

                        {donor.mobile && (
                          <a
                            href={`tel:${donor.mobile}`}
                            className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            <PhoneCall size={14} /> Call Donor ({donor.mobile})
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Animated Request Timeline */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                  Live Request Progress Timeline
                </h4>
                <RequestTimeline status={selectedReq.requestStatus} />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
              <button
                onClick={() => setSelectedReq(null)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl py-2.5 text-sm font-semibold transition cursor-pointer"
              >
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
