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

function PatientDetailsModal({ patient, open, onClose }) {
  if (!open || !patient) {
    return null;
  }

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString();
  };

  const patientInfo = [
    { label: "Patient Full Name", value: patient.patientName },
    { label: "Gender", value: patient.gender },
    { label: "Age", value: patient.age ? `${patient.age} yrs` : null },
    { label: "Blood Group Required", value: patient.bloodGroup },
    { label: "Units Required", value: patient.unitsRequired },
    { label: "Hospital Name", value: patient.hospitalName },
    { label: "Doctor Name", value: patient.doctorName },
    { label: "Attender Name", value: patient.attenderName },
    { label: "Attender Mobile Number", value: patient.attenderMobile },
    { label: "Required Date", value: formatDate(patient.requiredDate) },
    { label: "Emergency Level", value: patient.emergencyLevel },
    { label: "Request Status", value: patient.requestStatus },
    { label: "Address", value: patient.address },
    { label: "City", value: patient.city },
    { label: "State", value: patient.state },
    { label: "Pincode", value: patient.pincode },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Patient Request Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Patient ID: {patient.id}
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
            {patientInfo.map((info) => (
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

export default PatientDetailsModal;
