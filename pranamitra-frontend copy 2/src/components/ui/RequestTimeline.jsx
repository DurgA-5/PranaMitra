/* eslint-disable react-refresh/only-export-components */
import {
  FileText, CheckCircle2, UserCheck, PhoneCall, HandHeart, Building, Heart, Check
} from "lucide-react";

export const TIMELINE_STAGES = [
  {
    key: "CREATED",
    title: "Request Created",
    desc: "Emergency request raised & queued for admin review",
    icon: FileText,
  },
  {
    key: "APPROVED",
    title: "Admin Approved",
    desc: "Verified by emergency blood desk",
    icon: CheckCircle2,
  },
  {
    key: "ASSIGNED",
    title: "Donors Assigned",
    desc: "Matching donors located & notified",
    icon: UserCheck,
  },
  {
    key: "CONTACT_SHARED",
    title: "Patient & Donor Contact",
    desc: "Contact details exchanged for direct call",
    icon: PhoneCall,
  },
  {
    key: "ACCEPTED",
    title: "Donor Accepted",
    desc: "Donor confirmed willingness to donate",
    icon: HandHeart,
  },
  {
    key: "HOSPITAL_VISIT",
    title: "Hospital Visit",
    desc: "Donor arrived at hospital / blood bank",
    icon: Building,
  },
  {
    key: "COMPLETED",
    title: "Donation Completed",
    desc: "Blood donated successfully & life saved",
    icon: Heart,
  },
];

function getStageIndex(status) {
  switch (status) {
    case "PENDING":
      return 0; // Created
    case "APPROVED":
      return 3; // Approved, Assigned & Contact Shared!
    case "ACCEPTED":
    case "SCHEDULED":
      return 4; // Accepted
    case "IN_PROGRESS":
    case "HOSPITAL_VISIT":
      return 5; // Hospital Visit
    case "COMPLETED":
    case "DONATED":
      return 6; // Donation Completed
    case "CANCELLED":
    case "REJECTED":
      return -1;
    default:
      return 0;
  }
}

export default function RequestTimeline({ status = "PENDING", isHorizontal = false }) {
  const currentIdx = getStageIndex(status);
  const isCancelled = status === "CANCELLED" || status === "REJECTED";

  if (isHorizontal) {
    return (
      <div className="w-full py-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] relative px-4">
          {TIMELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isPassed = !isCancelled && idx <= currentIdx;
            const isCurrent = !isCancelled && idx === currentIdx;

            return (
              <div key={stage.key} className="flex flex-col items-center relative z-10 text-center flex-1">
                {/* Connecting Line */}
                {idx > 0 && (
                  <div
                    className={`absolute top-4 right-1/2 left-[-50%] h-1 transition-all duration-500 -z-10 ${
                      !isCancelled && idx <= currentIdx ? "bg-gradient-to-r from-red-500 to-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? "bg-red-600 text-white ring-4 ring-red-100 scale-110 shadow-lg shadow-red-500/30 animate-pulse"
                      : isPassed
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {isPassed && !isCurrent ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
                </div>

                {/* Stage Title */}
                <span
                  className={`mt-2 text-xs font-bold transition-colors ${
                    isCurrent ? "text-red-600" : isPassed ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {stage.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      {TIMELINE_STAGES.map((stage, idx) => {
        const Icon = stage.icon;
        const isPassed = !isCancelled && idx <= currentIdx;
        const isCurrent = !isCancelled && idx === currentIdx;

        return (
          <div key={stage.key} className="relative flex items-start gap-4 group">
            {/* Step Icon */}
            <div
              className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                isCurrent
                  ? "bg-red-600 text-white ring-4 ring-red-100 scale-110 shadow-md shadow-red-500/20 animate-pulse"
                  : isPassed
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white border-2 border-slate-300 text-slate-400"
              }`}
            >
              {isPassed && !isCurrent ? <Check size={12} strokeWidth={3} /> : <Icon size={12} />}
            </div>

            {/* Stage Info */}
            <div className="pl-2">
              <h4
                className={`text-sm font-bold flex items-center gap-2 ${
                  isCurrent ? "text-red-600" : isPassed ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {stage.title}
                {isCurrent && (
                  <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full animate-pulse">
                    Live Status
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{stage.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
