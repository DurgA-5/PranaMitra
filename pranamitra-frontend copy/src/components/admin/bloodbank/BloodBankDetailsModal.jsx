import { X } from "lucide-react";

function Info({ label, value }) {
  const displayValue =
    value === null || value === undefined || value === "" ? "-" : value;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {displayValue}
      </p>
    </div>
  );
}

function BloodBankDetailsModal({ bank, open, onClose }) {
  if (!open || !bank) {
    return null;
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    return timeStr.substring(0, 5);
  };

  const bankInfo = [
    { label: "Blood Bank Name", value: bank.bloodBankName },
    { label: "License Number", value: bank.licenseNumber },
    { label: "Manager Name", value: bank.managerName },
    { label: "Email Address", value: bank.email },
    { label: "Phone Number", value: bank.mobileNumber },
    {
      label: "Operating Hours",
      value: bank.available24Hours
        ? "Available 24 Hours"
        : `${formatTime(bank.openingTime)} - ${formatTime(bank.closingTime)}`,
    },
    { label: "Address", value: bank.address },
    { label: "City", value: bank.city },
    { label: "State", value: bank.state },
    { label: "Pincode", value: bank.pincode },
    { label: "Status", value: bank.active ? "Active" : "Inactive" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex h-full max-h-[80vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Blood Bank Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Blood Bank ID: {bank.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {bankInfo.map((info) => (
              <Info key={info.label} label={info.label} value={info.value} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-100 px-6 py-4 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BloodBankDetailsModal;
