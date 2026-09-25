import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Search, X, Check, Eye, Ban, RefreshCw, PhoneCall, MapPin, Building, User, Calendar } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import PriorityBadge from "../../components/ui/PriorityBadge";

function MatchingRequests() {
  const userId = getUserId();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");

  // Details Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getMatchingRequests(userId);
      setRequests(data || []);
    } catch (error) {
      console.error("Failed to load matching requests", error);
      toast.error("Failed to fetch matching requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cities = useMemo(() => {
    const unique = new Set(requests.map((r) => r.city || r.patient?.city).filter(Boolean));
    return Array.from(unique).sort();
  }, [requests]);

  const hospitals = useMemo(() => {
    const unique = new Set(requests.map((r) => r.hospitalName || r.patient?.hospitalName).filter(Boolean));
    return Array.from(unique).sort();
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return requests.filter((req) => {
      const pCity = req.city || req.patient?.city || "";
      const pHospital = req.hospitalName || req.patient?.hospitalName || "";

      const matchesSearch =
        !query ||
        req.patientName?.toLowerCase().includes(query) ||
        pCity.toLowerCase().includes(query) ||
        pHospital.toLowerCase().includes(query);

      const matchesPriority = !priorityFilter || req.emergencyLevel === priorityFilter;
      const matchesCity = !cityFilter || pCity === cityFilter;
      const matchesHospital = !hospitalFilter || pHospital === hospitalFilter;

      return matchesSearch && matchesPriority && matchesCity && matchesHospital;
    });
  }, [requests, debouncedSearch, priorityFilter, cityFilter, hospitalFilter]);

  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, currentPage, pageSize]);

  const handleAcceptClick = (requestId) => {
    setConfirmConfig({
      title: "Accept Emergency Blood Request",
      message: "Are you sure you want to accept this request? Patient & hospital emergency contact will be assigned to you.",
      type: "info",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.acceptRequest(requestId, userId);
          toast.success("Request accepted! High urgency notification sent to patient.");
          await loadRequests();
        } catch (error) {
          console.error("Failed to accept request", error);
          const errMsg = error.response?.data?.message || "Failed to accept request.";
          toast.error(errMsg);
        }
      },
    });
    setConfirmOpen(true);
  };

  const handleDeclineClick = (requestId) => {
    setConfirmConfig({
      title: "Decline Blood Request",
      message: "Are you sure you want to decline this request? It will be removed from your matching dashboard.",
      type: "warning",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.declineRequest(requestId, userId);
          toast.success("Request declined.");
          await loadRequests();
        } catch (error) {
          console.error("Failed to decline request", error);
          const errMsg = error.response?.data?.message || "Failed to decline request.";
          toast.error(errMsg);
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
            Matching Emergency Requests
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            Emergency blood requests matching your blood group. Direct contact details are shared immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-600 hover:border-red-300 hover:text-red-600 text-sm font-medium transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Matches
        </button>
      </div>

      {/* Filter Options */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex items-center rounded-xl border border-slate-200 px-3.5 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-50 transition bg-slate-50 relative">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, hospital..."
              className="ml-2 w-full py-2.5 outline-none bg-transparent text-sm text-slate-800 pr-6"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:bg-slate-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-sm text-slate-700 outline-none focus:border-red-500 transition"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-sm text-slate-700 outline-none focus:border-red-500 transition"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 bg-slate-50 text-sm text-slate-700 outline-none focus:border-red-500 transition"
          >
            <option value="">All Hospitals</option>
            {hospitals.map((hosp) => (
              <option key={hosp} value={hosp}>{hosp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matching Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-2xl"></div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No Matching Requests"
          description="There are currently no active emergency blood requests matching your filter criteria."
          icon={Ban}
          actionText="Clear Filters"
          onAction={() => {
            setSearch("");
            setPriorityFilter("");
            setCityFilter("");
            setHospitalFilter("");
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {paginatedRequests.map((req) => {
              const patientMobile = req.patientMobile || req.attenderMobile || "9876543210";
              const hospitalAddress = req.hospitalAddress || `${req.hospitalName || "Apollo Hospital"}, ${req.city || "City Center"}`;

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          {req.requestNumber || `#BR-${req.id}`}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2 mt-0.5">
                          {req.patientName || "Emergency Patient"}
                        </h3>
                      </div>
                      <PriorityBadge priority={req.emergencyLevel} size="md" />
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-3 my-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Blood Group</span>
                        <span className="font-extrabold text-red-600 text-sm mt-0.5 block">
                          🩸 {formatBloodGroup(req.bloodGroup)}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Units Required</span>
                        <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                          {req.unitsRequired || 1} Unit(s)
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Hospital</span>
                        <span className="font-semibold text-slate-700 mt-0.5 block truncate flex items-center gap-1">
                          <Building size={12} className="text-slate-400" />
                          {req.hospitalName || "City General Hospital"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Doctor</span>
                        <span className="font-semibold text-slate-700 mt-0.5 block truncate flex items-center gap-1">
                          <User size={12} className="text-slate-400" />
                          {req.doctorName || "Attending Physician"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Distance</span>
                        <span className="font-bold text-emerald-600 mt-0.5 block flex items-center gap-1">
                          <MapPin size={12} /> {req.distance || "3.2 km"}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Required Date</span>
                        <span className="font-semibold text-slate-700 mt-0.5 block flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" /> {req.requiredDate || "Immediate"}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-4">
                      <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>{hospitalAddress}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-2">
                    {/* Call Patient */}
                    <a
                      href={`tel:${patientMobile}`}
                      className="col-span-1 flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold py-2.5 transition shadow-sm shadow-emerald-600/20"
                    >
                      <PhoneCall size={14} /> Call
                    </a>

                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="col-span-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold py-2.5 transition"
                    >
                      <Eye size={14} /> Details
                    </button>

                    {/* Accept */}
                    <button
                      type="button"
                      onClick={() => handleAcceptClick(req.id)}
                      className="col-span-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold py-2.5 transition shadow-sm shadow-red-600/20"
                    >
                      <Check size={14} /> Accept
                    </button>

                    {/* Reject */}
                    <button
                      type="button"
                      onClick={() => handleDeclineClick(req.id)}
                      className="col-span-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl text-xs font-semibold py-2.5 border border-slate-200 transition"
                    >
                      <Ban size={14} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredRequests.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        {...confirmConfig}
      />

      {/* View Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-slate-100">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {selectedRequest.requestNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-800">Matching Request Emergency Details</h3>
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
                  <span className="font-bold text-slate-800">{selectedRequest.unitsRequired} Unit(s)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider">Priority</span>
                  <PriorityBadge priority={selectedRequest.emergencyLevel} size="sm" />
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">Hospital & Doctor</span>
                <p className="font-bold text-slate-800">{selectedRequest.hospitalName || "City General Hospital"}</p>
                <p className="text-xs text-slate-500">Doctor in Charge: {selectedRequest.doctorName || "Dr. Kumar"}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Address: {selectedRequest.hospitalAddress || `${selectedRequest.city || "City Center"}, ${selectedRequest.pincode || "500001"}`}
                </p>
              </div>

              <div className="border-t pt-4">
                <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-2">Emergency Contact Sharing</span>
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  <div>
                    <span className="text-xs text-emerald-700 font-bold block">Patient Mobile Number</span>
                    <span className="font-extrabold text-emerald-900 text-sm">
                      {selectedRequest.patientMobile || selectedRequest.attenderMobile || "+91 98765 43210"}
                    </span>
                  </div>
                  <a
                    href={`tel:${selectedRequest.patientMobile || selectedRequest.attenderMobile || "9876543210"}`}
                    className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                  >
                    <PhoneCall size={14} /> Call Now
                  </a>
                </div>
              </div>

              {selectedRequest.remarks && (
                <div className="border-t pt-4">
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-wider mb-1">Remarks</span>
                  <p className="text-xs italic text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    {selectedRequest.remarks}
                  </p>
                </div>
              )}
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
    </>
  );
}

export default MatchingRequests;
