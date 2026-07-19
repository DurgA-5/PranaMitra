import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import bloodRequestService from "../../services/bloodRequestService";

function EmergencyAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await bloodRequestService.getAllRequests();
        const list = Array.isArray(response) ? response : response?.data ?? [];
        
        // Filter requests with CRITICAL/HIGH emergency level that are not completed/cancelled
        const criticalRequests = list.filter(
          (req) =>
            (req.emergencyLevel === "CRITICAL" || req.emergencyLevel === "HIGH") &&
            (req.requestStatus === "PENDING" || req.requestStatus === "APPROVED")
        );

        setAlerts(criticalRequests);
      } catch (error) {
        console.error("Failed to load emergency alerts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-100 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 select-none">
      <h2 className="text-base font-bold text-slate-800 tracking-tight mb-5">
        Emergency Alerts
      </h2>

      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircleIcon size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-800">System Operating Normally</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">No critical blood request escalations active.</p>
            </div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 bg-red-50/40 border border-red-100 rounded-xl shadow-sm hover:shadow transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 animate-pulse">
                  <AlertCircle size={18} />
                </div>
                <div className="min-w-0">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full inline-block ${
                    alert.emergencyLevel === "CRITICAL" ? "bg-red-600 text-white" : "bg-orange-500 text-white"
                  }`}>
                    {alert.emergencyLevel}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {alert.unitsRequired} Units of {formatBloodGroup(alert.bloodGroup)} Required
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {alert.patientName} at {alert.hospitalName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/admin/requests")}
                className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-white border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-red-50 transition shrink-0 ml-4"
              >
                <span>Respond</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Internal small helper icons
function CheckCircleIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default EmergencyAlerts;