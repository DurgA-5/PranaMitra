import Card from "./Card";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "slate", // slate, red, rose, emerald, amber, blue
  className = "",
}) {
  const themeVariants = {
    slate: {
      iconBg: "bg-slate-50 border-slate-100 text-slate-500",
      accent: "border-l-4 border-l-slate-400",
    },
    red: {
      iconBg: "bg-red-50 border-red-100 text-red-600",
      accent: "border-l-4 border-l-red-500",
    },
    rose: {
      iconBg: "bg-rose-50 border-rose-100 text-rose-500",
      accent: "border-l-4 border-l-rose-500",
    },
    emerald: {
      iconBg: "bg-emerald-50 border-emerald-100 text-emerald-600",
      accent: "border-l-4 border-l-emerald-500",
    },
    amber: {
      iconBg: "bg-amber-50 border-amber-100 text-amber-500",
      accent: "border-l-4 border-l-amber-500",
    },
    blue: {
      iconBg: "bg-blue-50 border-blue-100 text-blue-500",
      accent: "border-l-4 border-l-blue-500",
    },
  };

  const selectedTheme = themeVariants[variant] || themeVariants.slate;

  return (
    <Card
      hoverable
      className={`p-6 flex items-start justify-between gap-4 transition-all duration-300 ${selectedTheme.accent} ${className}`}
    >
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-slate-900 leading-none">
          {value !== undefined ? value : "0"}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 font-semibold pt-1">
            {description}
          </p>
        )}
      </div>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${selectedTheme.iconBg}`}>
          <Icon size={22} className="stroke-[2.5]" />
        </div>
      )}
    </Card>
  );
}

export default StatCard;
