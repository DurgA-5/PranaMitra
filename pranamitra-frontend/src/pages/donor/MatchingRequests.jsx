import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Search, X, Check, Eye, Ban, RefreshCw } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

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

  // Sort State
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Filter Reset
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, priorityFilter, cityFilter, hospitalFilter]);

  // Extract unique cities & hospitals lists for filters
  const cities = useMemo(() => {
    const unique = new Set(requests.map((r) => r.city || r.patient?.city).filter(Boolean));
    return Array.from(unique).sort();
  }, [requests]);

  const hospitals = useMemo(() => {
    const unique = new Set(requests.map((r) => r.hospitalName || r.patient?.hospitalName).filter(Boolean));
    return Array.from(unique).sort();
  }, [requests]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter matching requests
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

  // Sort logic
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "patientName") {
        aVal = a.patientName || "";
        bVal = b.patientName || "";
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });
  }, [filteredRequests, sortField, sortOrder]);

  // Paginated logic
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRequests.slice(start, start + pageSize);
  }, [sortedRequests, currentPage, pageSize]);

  // Accept trigger
  const handleAcceptClick = (requestId) => {
    setConfirmConfig({
      title: "Accept Blood Request",
      message: "Are you sure you want to accept this request? Doing so will schedule a blood donation appointment.",
      type: "info",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.acceptRequest(requestId, userId);
          toast.success("Request accepted! A donation has been scheduled.");
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

  // Decline trigger
  const handleDeclineClick = (requestId) => {
    setConfirmConfig({
      title: "Decline Blood Request",
      message: "Are you sure you want to decline this request? It will be removed from your matching dashboard.",
      type: "warning",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await donorPortalService.declineRequest(requestId, userId);
          toast.success("Request declined and hidden.");
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

  const handleClearFilters = () => {
    setSearch("");
    setPriorityFilter("");
    setCityFilter("");
    setHospitalFilter("");
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
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Matching Blood Requests</h1>
          <p className="mt-2 text-gray-500 font-medium">Accept or decline active requests matching your blood group.</p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* Filter Options */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Search Patient/Hospital/City */}
          <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-50 transition bg-white relative">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, hospital, city..."
              className="ml-3 w-full py-3 outline-none bg-transparent text-sm text-slate-800 pr-6"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
          >
            <option value="">All Hospitals</option>
            {hospitals.map((hosp) => (
              <option key={hosp} value={hosp}>
                {hosp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No Matching Requests"
          description="There are currently no active blood requests matching your profile criteria."
          icon={Ban}
          actionText="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Request No</th>
                    <th
                      onClick={() => handleSort("patientName")}
                      className="px-6 py-4 font-semibold cursor-pointer hover:bg-slate-100 select-none"
                    >
                      Patient Name
                    </th>
                    <th className="px-6 py-4 font-semibold">Blood Group</th>
                    <th className="px-6 py-4 font-semibold">Units Required</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Required Date</th>
                    <th className="px-6 py-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {req.requestNumber || `#${req.id}`}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {req.patientName || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-bold border border-red-100">
                          {formatBloodGroup(req.bloodGroup)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-bold">{req.unitsRequired}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            req.emergencyLevel === "CRITICAL"
                              ? "bg-red-50 text-red-700 border border-red-200 animate-pulse font-bold"
                              : req.emergencyLevel === "HIGH"
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {req.emergencyLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-mono">{req.requiredDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
                          >
                            <Eye size={14} /> Details
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAcceptClick(req.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold bg-green-600 text-white hover:bg-green-700 px-3 py-1.5 rounded-lg transition"
                          >
                            <Check size={14} /> Accept
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeclineClick(req.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition"
                          >
                            <Ban size={14} /> Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {/* Details View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Matching Request Details</h3>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">Patient Name</span>
                  <span className="font-bold text-slate-800">{selectedRequest.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">Blood Group</span>
                  <span className="font-bold text-red-600">{formatBloodGroup(selectedRequest.bloodGroup)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">Units Required</span>
                  <span className="font-bold text-slate-800">{selectedRequest.unitsRequired}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider">Priority Level</span>
                  <span className="font-bold text-slate-800">{selectedRequest.emergencyLevel}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider mb-2">Hospital Information</span>
                <p className="font-bold text-slate-800">
                  {selectedRequest.hospitalName || selectedRequest.patient?.hospitalName || "General Hospital"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  City: {selectedRequest.city || selectedRequest.patient?.city || "-"}
                </p>
              </div>

              {selectedRequest.remarks && (
                <div className="border-t pt-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-slate-400 block text-xs font-semibold uppercase tracking-wider mb-1">Remarks / Notes</span>
                  <p className="text-xs italic text-slate-600 leading-relaxed">{selectedRequest.remarks}</p>
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
