import { useEffect, useRef } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";

function ConfirmationModal({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  type = "danger", // 'danger', 'warning', 'info'
}) {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (open && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getThemeClasses = () => {
    switch (type) {
      case "danger":
        return {
          icon: <AlertTriangle className="text-red-600" size={24} />,
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
          bg: "bg-red-50",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="text-amber-600" size={24} />,
          button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white",
          bg: "bg-amber-50",
        };
      default:
        return {
          icon: <HelpCircle className="text-blue-600" size={24} />,
          button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
          bg: "bg-blue-50",
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${theme.bg}`}>
            {theme.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              id="confirm-modal-title"
              className="text-lg font-bold text-slate-900 leading-6"
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-slate-100"
          >
            {cancelText}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
