import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Activity, Search, X, CheckCircle, Circle, Clock, RefreshCw } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";
import EmptyState from "../../components/common/EmptyState";

const BLOOD_GROUPS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

const TIMELINE_STEPS = [
  { status: "PENDING",   label: "Request Submitted",  desc: "Your blood request has been received and is under review." },
  { status: "APPROVED",  label: "Donor Being Matched", desc: "Your request is approved. A compatible donor is being matched." },
  { status: "COMPLETED", label: "Donation Completed",  desc: "A donor has completed the blood donation. Thank you!" },
];

const STATUS_ORDER = { PENDING: 0, APPROVED: 1, COMPLETED: 2, CANCELLED: -1, REJECTED: -1 };

function getStepState(stepStatus, currentStatus) {
  if (currentStatus === "CANCELLED" || currentStatus === "REJECTED") return "cancelled";
  const stepIndex = STATUS_ORDER[stepStatus] ?? 0;
  const currentIndex = STATUS_ORDER[currentStatus] ?? 0;
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "active";
  return "upcoming";
}

function TrackRequest() {
  const userId = getUserId();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await patientPortalService.getMyBloodRequests(userId);
      setRequests(Array.isArray(data) ? data : []);
      if (selected) {
        const updated = data.find((r) => r.id === selected.id);
        if (updated) setSelected(updated);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const filtered = useMemo(() => {
    if (!search) return requests;
    return requests.filter((r) =>
      (r.requestNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (BLOOD_GROUPS[r.bloodGroup] ?? r.bloodGroup ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [requests, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-red-500" size={24} /> Track Request
          </h1>
          <p className="text-slate-500 text-sm mt-1">Click any request to see its live status timeline.</p>
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Request List */}
        <div className="lg:col-span-2 space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-white shadow-sm">
            <Search size={15} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="flex-1 py-2.5 bg-transparent text-sm outline-none text-slate-700"
            />
            {search && <button onClick={() => setSearch("")}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No Requests" description="No requests found to track." icon={Activity} />
          ) : (
            filtered.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelected(req)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selected?.id === req.id
                    ? "border-red-300 bg-red-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-red-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600">{req.requestNumber}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                    req.requestStatus === "COMPLETED" ? "bg-green-100 text-green-700" :
                    req.requestStatus === "APPROVED"  ? "bg-blue-100 text-blue-700" :
                    req.requestStatus === "CANCELLED" ? "bg-slate-100 text-slate-500" :
                    req.requestStatus === "REJECTED"  ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{req.requestStatus}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  🩸 {BLOOD_GROUPS[req.bloodGroup] ?? req.bloodGroup} · {req.unitsRequired} unit{req.unitsRequired > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Required: {req.requiredDate}</p>
              </button>
            ))
          )}
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
              <Activity size={48} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">Select a request to view its timeline</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              {/* Header */}
              <div className="mb-6 pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tracking</p>
                <h3 className="text-lg font-bold text-slate-800">{selected.requestNumber}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600">
                  <span>🩸 {BLOOD_GROUPS[selected.bloodGroup] ?? selected.bloodGroup}</span>
                  <span>· {selected.unitsRequired} unit{selected.unitsRequired > 1 ? "s" : ""}</span>
                  <span>· {selected.emergencyLevel} priority</span>
                </div>
              </div>

              {/* Cancelled / Rejected Banner */}
              {(selected.requestStatus === "CANCELLED" || selected.requestStatus === "REJECTED") ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                    <X size={32} className="text-red-400" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">Request {selected.requestStatus}</h4>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs">
                    {selected.requestStatus === "CANCELLED"
                      ? "This request was cancelled. You may submit a new request if needed."
                      : "This request was rejected. Please contact our support team for more information."}
                  </p>
                </div>
              ) : (
                /* Timeline */
                <div className="space-y-0">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const state = getStepState(step.status, selected.requestStatus);
                    const isLast = idx === TIMELINE_STEPS.length - 1;
                    return (
                      <div key={step.status} className="flex gap-4">
                        {/* Icon + Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            state === "done"   ? "border-green-500 bg-green-500" :
                            state === "active" ? "border-red-500 bg-red-50" :
                            "border-slate-200 bg-white"
                          }`}>
                            {state === "done" ? (
                              <CheckCircle size={20} className="text-white" />
                            ) : state === "active" ? (
                              <Clock size={18} className="text-red-500 animate-pulse" />
                            ) : (
                              <Circle size={18} className="text-slate-300" />
                            )}
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 h-12 mt-1 ${state === "done" ? "bg-green-300" : "bg-slate-200"}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`pb-8 flex-1 ${isLast ? "pb-0" : ""}`}>
                          <h4 className={`font-bold text-sm ${
                            state === "done" ? "text-green-700" :
                            state === "active" ? "text-red-600" :
                            "text-slate-400"
                          }`}>{step.label}</h4>
                          <p className={`text-xs mt-0.5 leading-relaxed ${
                            state === "upcoming" ? "text-slate-300" : "text-slate-500"
                          }`}>{step.desc}</p>
                          {state === "active" && (
                            <span className="inline-block mt-1.5 text-xs bg-red-50 text-red-600 font-bold px-2.5 py-0.5 rounded-full border border-red-100 animate-pulse">
                              In Progress
                            </span>
                          )}
                          {state === "done" && (
                            <span className="inline-block mt-1.5 text-xs bg-green-50 text-green-700 font-bold px-2.5 py-0.5 rounded-full border border-green-100">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Remarks */}
              {selected.remarks && (
                <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-amber-800">{selected.remarks}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrackRequest;
