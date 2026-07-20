import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, X, Calendar, RefreshCw, PhoneCall, Building, User, MapPin, Eye } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import EmptyState from "../../components/common/EmptyState";
import PriorityBadge from "../../components/ui/PriorityBadge";

function AcceptedRequests() {
  const userId = getUserId();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getAcceptedRequests(userId);
      setRequests(data || []);
    } catch (error) {
      console.error("Failed to load accepted requests", error);
      toast.error("Failed to fetch accepted requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompleteClick = (donationId) => {
    setConfirmConfig({
      title: "Mark Donation Completed",
      message: "Are you sure you have completed this blood donation at the hospital? Confirming this updates your last donation date and marks the emergency request as fulfilled.",
      type: "info",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.completeDonation(donationId, userId);
          toast.success("Thank you for saving a life! Donation marked as completed.");
          await loadRequests();
        } catch (error) {
          console.error("Failed to complete donation", error);
          toast.error("Failed to mark donation as complete.");
        }
      },
    });
    setConfirmOpen(true);
  };

  const handleCancelClick = (donationId) => {
    setConfirmConfig({
      title: "Cancel Donation Appointment",
      message: "Are you sure you want to cancel this scheduled donation? The matching request will be returned to emergency matching.",
      type: "warning",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.cancelDonation(donationId, userId);
          toast.success("Donation appointment cancelled successfully.");
          await loadRequests();
        } catch (error) {
          console.error("Failed to cancel donation", error);
          toast.error("Failed to cancel donation.");
        }
      },
    });
    setConfirmOpen(true);
  };

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

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Accepted Blood Requests
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Active scheduled donation commitments. Contact patient directly to coordinate arrival.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh List
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-2xl"></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No Accepted Requests"
          description="You don't have any scheduled blood donations active at this time."
          icon={Calendar}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((item) => {
            const patientMobile = item.patientMobile || item.attenderMobile || "9876543210";
            const emergencyContact = item.attenderName ? `${item.attenderName} (${item.attenderMobile || patientMobile})` : patientMobile;
            const hospitalAddress = item.hospitalAddress || `${item.hospitalName || "General Hospital"}, ${item.city || "City Center"}`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  {/* Status & Priority Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        SCHEDULED DONATION #{item.id}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
                        {item.patientName || "Patient"}
                      </h3>
                    </div>
                    <PriorityBadge priority={item.emergencyLevel || "HIGH"} size="md" />
                  </div>

                  {/* Immediate Emergency Contact Sharing Banner */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                        Emergency Contact Sharing
                      </span>
                      <span className="text-sm font-extrabold text-emerald-950 block mt-0.5">
                        {patientMobile}
                      </span>
                      {item.attenderName && (
                        <span className="text-xs text-emerald-700 block">
                          Attender: {emergencyContact}
                        </span>
                      )}
                    </div>
                    <a
                      href={`tel:${patientMobile}`}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      <PhoneCall size={14} /> Call Patient
                    </a>
                  </div>

                  {/* Patient & Hospital Details Grid */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Blood Group</span>
                      <span className="font-extrabold text-red-600 text-sm mt-0.5 block">
                        🩸 {formatBloodGroup(item.bloodGroup)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Units Required</span>
                      <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                        {item.units || 1} Unit(s)
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Hospital</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block truncate flex items-center gap-1">
                        <Building size={12} className="text-slate-400" />
                        {item.hospitalName || "General Hospital"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Doctor</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block truncate flex items-center gap-1">
                        <User size={12} className="text-slate-400" />
                        {item.doctorName || "Attending Physician"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Required Date</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        {item.requiredDate || item.donationDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Current Status</span>
                      <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 mt-0.5">
                        ● {item.status || "SCHEDULED"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-4">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{hospitalAddress}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(item)}
                    className="flex items-center gap-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition"
                  >
                    <Eye size={14} /> Details
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCancelClick(item.id)}
                      className="flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl border border-slate-200 transition"
                    >
                      <X size={14} /> Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteClick(item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition shadow-sm shadow-green-600/20"
                    >
                      <Check size={14} /> Mark Completed
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-slate-100">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  APPOINTMENT #{selectedRequest.id}
                </span>
                <h3 className="text-lg font-bold text-slate-800">Accepted Request Emergency Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">Patient Name</span>
                  <span className="font-bold text-slate-800">{selectedRequest.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">Blood Group</span>
                  <span className="font-bold text-red-600">{formatBloodGroup(selectedRequest.bloodGroup)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">Units Required</span>
                  <span className="font-bold text-slate-800">{selectedRequest.units || 1} Unit(s)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">Priority</span>
                  <PriorityBadge priority={selectedRequest.emergencyLevel || "HIGH"} size="sm" />
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">Hospital & Doctor Details</span>
                <p className="font-bold text-slate-800">{selectedRequest.hospitalName || "Hospital Medical Center"}</p>
                <p className="text-xs text-slate-500">Doctor: {selectedRequest.doctorName || "Attending Physician"}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Hospital Address: {selectedRequest.hospitalAddress || `${selectedRequest.city || "City Center"}, ${selectedRequest.pincode || "500001"}`}
                </p>
              </div>

              <div className="border-t pt-4">
                <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-2">Emergency Contacts</span>
                <div className="space-y-2 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-700 font-bold block">Patient Mobile Number</span>
                      <span className="font-extrabold text-emerald-950 text-sm">
                        {selectedRequest.patientMobile || selectedRequest.attenderMobile || "+91 98765 43210"}
                      </span>
                    </div>
                    <a
                      href={`tel:${selectedRequest.patientMobile || selectedRequest.attenderMobile || "9876543210"}`}
                      className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      <PhoneCall size={14} /> Call
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        {...confirmConfig}
      />
    </>
  );
}

export default AcceptedRequests;
