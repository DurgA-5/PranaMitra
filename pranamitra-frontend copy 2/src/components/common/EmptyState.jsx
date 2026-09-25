import { Search } from "lucide-react";

function EmptyState({
  title = "No Data Found",
  description = "There are no records to display at this moment.",
  actionText,
  onAction,
  icon: Icon = Search,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
      {/* Icon Wrapper */}
      <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl mb-4 border border-slate-100">
        <Icon size={40} className="stroke-[1.5]" />
      </div>

      {/* Texts */}
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed">
        {description}
      </p>

      {/* Call to Action Button */}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-100"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
