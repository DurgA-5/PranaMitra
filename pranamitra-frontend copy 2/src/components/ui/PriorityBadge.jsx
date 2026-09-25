/* eslint-disable react-refresh/only-export-components */
import { AlertTriangle, AlertCircle, ShieldAlert, Clock } from "lucide-react";

export function getPriorityStyles(priority) {
  const normalized = (priority || "MEDIUM").toUpperCase();

  switch (normalized) {
    case "CRITICAL":
      return {
        badgeClass: "bg-red-500/10 text-red-600 border-red-500/30 animate-pulse font-bold",
        dotClass: "bg-red-500 animate-ping",
        icon: ShieldAlert,
        label: "CRITICAL",
      };
    case "HIGH":
      return {
        badgeClass: "bg-orange-500/10 text-orange-600 border-orange-500/30 font-semibold",
        dotClass: "bg-orange-500",
        icon: AlertTriangle,
        label: "HIGH",
      };
    case "MEDIUM":
      return {
        badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30 font-medium",
        dotClass: "bg-amber-500",
        icon: AlertCircle,
        label: "MEDIUM",
      };
    case "LOW":
    default:
      return {
        badgeClass: "bg-slate-500/10 text-slate-600 border-slate-500/20 font-medium",
        dotClass: "bg-slate-400",
        icon: Clock,
        label: "LOW",
      };
  }
}

export default function PriorityBadge({ priority, size = "md", showIcon = true }) {
  const { badgeClass, dotClass, icon: Icon, label } = getPriorityStyles(priority);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1 rounded-md",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
    lg: "px-3 py-1.5 text-sm gap-2 rounded-xl",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center border tracking-wide select-none ${sizeClasses[size] || sizeClasses.md} ${badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
      {showIcon && <Icon size={iconSizes[size] || 14} className="shrink-0" />}
      <span>{label}</span>
    </span>
  );
}
