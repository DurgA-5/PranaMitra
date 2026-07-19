import { useState } from "react";
import { CheckCircle2, Power, X } from "lucide-react";
import { toast } from "react-toastify";
import studentDonorService from "../../../services/studentDonorService";

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

function DonorDetailsModal({ donor, open, onClose, onRefresh }) {
  const [processing, setProcessing] = useState(false);

  if (!open || !donor) {
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

  const handleVerify = async () => {
    try {
      setProcessing(true);
      await studentDonorService.verifyDonor(donor.id);
      await onRefresh();
      onClose();
      toast.success(
        donor.verified
          ? "Donor unverified successfully."
          : "Donor verified successfully."
      );
    } catch (error) {
      console.error("Failed to verify donor", error);
      toast.error("Unable to verify donor. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleStatusToggle = async () => {
    try {
      setProcessing(true);
      await studentDonorService.toggleStatus(donor.id);
      await onRefresh();
      onClose();
      toast.success(
        donor.active
          ? "Donor deactivated successfully."
          : "Donor activated successfully."
      );
    } catch (error) {
      console.error("Failed to update donor status", error);
      toast.error("Unable to update donor status. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const donorInfo = [
    { label: "Full Name", value: donor.fullName },
    { label: "Email", value: donor.email },
    { label: "Mobile Number", value: donor.mobileNumber },
    { label: "Blood Group", value: donor.bloodGroup },
    { label: "Age", value: donor.age },
    { label: "Gender", value: donor.gender },
    { label: "Weight", value: donor.weight ? `${donor.weight} kg` : null },
    { label: "College", value: donor.collegeName },
    { label: "Department", value: donor.department },
    { label: "Year Of Study", value: donor.yearOfStudy },
    { label: "Student ID", value: donor.studentId },
    { label: "Address", value: donor.address },
    { label: "City", value: donor.city },
    { label: "State", value: donor.state },
    { label: "Pincode", value: donor.pincode },
    {
      label: "Last Donation Date",
      value: formatDate(donor.lastDonationDate),
    },
    {
      label: "Available To Donate",
      value: donor.availableToDonate ? "Yes" : "No",
    },
    { label: "Verified", value: donor.verified ? "Yes" : "No" },
    { label: "Active", value: donor.active ? "Yes" : "No" },
    { label: "Created Date", value: formatDate(donor.createdAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Donor Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review donor information and account status.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close donor details"
          >
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            {donorInfo.map((item) => (
              <Info key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            {donor.verified ? (
              <button
                type="button"
                onClick={handleVerify}
                disabled={processing}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Power size={18} />
                Unverify Donor
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerify}
                disabled={processing}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={18} />
                Verify Donor
              </button>
            )}

            <button
              type="button"
              onClick={handleStatusToggle}
              disabled={processing}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Power size={18} />
              {donor.active ? "Deactivate Donor" : "Activate Donor"}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorDetailsModal;
