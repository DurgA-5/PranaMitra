import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Activity, Search, X, RefreshCw } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";
import EmptyState from "../../components/common/EmptyState";
import RequestTimeline from "../../components/ui/RequestTimeline";
import PriorityBadge from "../../components/ui/PriorityBadge";

const BLOOD_GROUPS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

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
      const list = Array.isArray(data) ? data : [];
      setRequests(list);
      if (selected) {
        const updated = list.find((r) => r.id === selected.id);
        if (updated) setSelected(updated);
      } else if (list.length > 0) {
        setSelected(list[0]);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
            <Activity className="text-red-500" size={26} /> Live Request Timeline Tracker
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time status tracking for emergency blood request processing stages.
          </p>
        </div>
        <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm shrink-0">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Live Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Request List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 bg-white shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request # or blood group..."
              className="flex-1 py-2.5 bg-transparent text-sm outline-none text-slate-700"
            />
            {search && <button onClick={() => setSearch("")}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No Requests" description="No blood requests found to track." icon={Activity} />
          ) : (
            filtered.map((req) => (
              <button
                key={req.id}
                onClick={() => setSelected(req)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selected?.id === req.id
                    ? "border-red-500 bg-red-50/50 shadow-md ring-2 ring-red-500/10"
                    : "border-slate-200 bg-white hover:border-red-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-600">{req.requestNumber}</span>
                  <PriorityBadge priority={req.emergencyLevel} size="sm" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-extrabold text-slate-800">
                    🩸 {BLOOD_GROUPS[req.bloodGroup] ?? req.bloodGroup} · {req.unitsRequired} Unit(s)
                  </p>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    req.requestStatus === "COMPLETED" ? "bg-green-100 text-green-700" :
                    req.requestStatus === "APPROVED"  ? "bg-blue-100 text-blue-700" :
                    req.requestStatus === "CANCELLED" ? "bg-slate-100 text-slate-500" :
                    "bg-amber-100 text-amber-700"
                  }`}>{req.requestStatus}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: Live Timeline Panel */}
        <div className="lg:col-span-3">
          {!selected ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full min-h-[350px] text-slate-400 p-6">
              <Activity size={48} className="mb-3 opacity-30 text-red-500" />
              <p className="text-sm font-bold text-slate-600">Select a blood request to view live timeline progress</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
              {/* Request Header */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block">Live Timeline Tracking</span>
                  <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">{selected.requestNumber}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-red-50 text-red-700 font-extrabold text-xs px-3 py-1 rounded-xl border border-red-100">
                    🩸 {BLOOD_GROUPS[selected.bloodGroup] ?? selected.bloodGroup} ({selected.unitsRequired} Units)
                  </span>
                  <PriorityBadge priority={selected.emergencyLevel} size="md" />
                </div>
              </div>

              {/* Cancelled Banner */}
              {(selected.requestStatus === "CANCELLED" || selected.requestStatus === "REJECTED") ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-3 text-red-600 font-bold">
                    <X size={32} />
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-lg">Request {selected.requestStatus}</h4>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs">
                    {selected.requestStatus === "CANCELLED"
                      ? "This request was cancelled. You may raise a new emergency request anytime."
                      : "This request was reviewed and rejected by admin desk."}
                  </p>
                </div>
              ) : (
                /* Animated 7-Stage Request Timeline */
                <div className="pt-2">
                  <RequestTimeline status={selected.requestStatus} />
                </div>
              )}

              {/* Remarks */}
              {selected.remarks && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs">
                  <span className="font-bold text-amber-700 uppercase tracking-wider block mb-1">Additional Emergency Notes</span>
                  <p className="text-amber-900 font-medium">{selected.remarks}</p>
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
