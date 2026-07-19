import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, X, Calendar, RefreshCw } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import EmptyState from "../../components/common/EmptyState";

function AcceptedRequests() {
  const userId = getUserId();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Mark complete trigger
  const handleCompleteClick = (donationId) => {
    setConfirmConfig({
      title: "Mark Donation Fulfill Completed",
      message: "Are you sure you have completed this donation? Confirming this updates your last donation date, and marks this donation as successfully complete.",
      type: "info",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.completeDonation(donationId, userId);
          toast.success("Thank you! Donation marked as completed.");
          await loadRequests();
        } catch (error) {
          console.error("Failed to complete donation", error);
          toast.error("Failed to mark donation as complete.");
        }
      },
    });
    setConfirmOpen(true);
  };

  // Cancel trigger
  const handleCancelClick = (donationId) => {
    setConfirmConfig({
      title: "Cancel Donation Appointment",
      message: "Are you sure you want to cancel this scheduled donation? The matching request will be returned to the list.",
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
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Accepted Requests</h1>
          <p className="mt-2 text-gray-500 font-medium">Track your active scheduled donations and appointments.</p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No Accepted Requests"
          description="You don't have any scheduled blood donations active at this time."
          icon={Calendar}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Patient</th>
                  <th className="px-6 py-4 font-semibold">Hospital Name</th>
                  <th className="px-6 py-4 font-semibold text-center">Blood Group</th>
                  <th className="px-6 py-4 font-semibold">Scheduled Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {requests.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.patientName}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.hospitalName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold border border-red-100">
                        {formatBloodGroup(item.bloodGroup)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {item.donationDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCompleteClick(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl transition shadow-sm"
                        >
                          <Check size={14} /> Mark Completed
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelClick(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 border border-red-100 rounded-xl transition"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
