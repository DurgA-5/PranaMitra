import { X, CheckCircle2, XCircle, Award, Ban } from "lucide-react";
import { toast } from "react-toastify";
import bloodRequestService from "../../../services/bloodRequestService";

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

function RequestDetailsModal({ request, open, onClose, onRefresh }) {
  if (!open || !request) {
    return null;
  }

  const handleStatusChange = async (action, message) => {
    const confirmed = window.confirm(`Are you sure you want to ${action} this request?`);
    if (!confirmed) {
      return;
    }

    try {
      if (action === "approve") {
        await bloodRequestService.approveRequest(request.id);
      } else if (action === "reject") {
        await bloodRequestService.rejectRequest(request.id);
      } else if (action === "complete") {
        await bloodRequestService.completeRequest(request.id);
      } else if (action === "cancel") {
        await bloodRequestService.cancelRequest(request.id);
      }
      toast.success(message);
      if (onRefresh) {
        await onRefresh();
      }
      onClose();
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
      const errorMsg = error.response?.data?.message || `Unable to ${action} blood request.`;
      toast.error(errorMsg);
    }
  };

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

  const requestInfo = [
    { label: "Request Number", value: request.requestNumber },
    { label: "Patient Full Name", value: request.patientName },
    { label: "Patient ID", value: request.patientId },
    { label: "Blood Group Required", value: request.bloodGroup },
    { label: "Units Required", value: request.unitsRequired },
    { label: "Emergency Level", value: request.emergencyLevel },
    { label: "Request Status", value: request.requestStatus },
    { label: "Required Date", value: formatDate(request.requiredDate) },
    { label: "Remarks / Notes", value: request.remarks },
    { label: "Created At", value: formatDate(request.createdAt) },
    { label: "Updated At", value: formatDate(request.updatedAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex h-full max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Blood Request Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Request ID: {request.id}
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
            {requestInfo.map((info) => (
              <Info key={info.label} label={info.label} value={info.value} />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-between items-center gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
          
          <div className="flex gap-2">
            {request.requestStatus === "PENDING" && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange("approve", "Request approved successfully.")}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition shadow-sm"
                >
                  <CheckCircle2 size={16} /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("reject", "Request rejected.")}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm"
                >
                  <XCircle size={16} /> Reject
                </button>
              </>
            )}

            {request.requestStatus === "APPROVED" && (
              <>
                <button
                  type="button"
                  onClick={() => handleStatusChange("complete", "Request marked as completed.")}
                  className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition shadow-sm"
                >
                  <Award size={16} /> Complete
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("cancel", "Request cancelled.")}
                  className="flex items-center gap-2 rounded-xl bg-gray-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-600 transition shadow-sm"
                >
                  <Ban size={16} /> Cancel
                </button>
              </>
            )}

            {request.requestStatus === "REJECTED" && (
              <button
                type="button"
                onClick={() => handleStatusChange("approve", "Request approved successfully.")}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition shadow-sm"
              >
                <CheckCircle2 size={16} /> Approve
              </button>
            )}
          </div>

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

export default RequestDetailsModal;
