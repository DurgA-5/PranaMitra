import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, X, ClipboardList, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import AddRequestModal from "../../components/admin/request/AddRequestModal";
import RequestDetailsModal from "../../components/admin/request/RequestDetailsModal";
import RequestTable from "../../components/admin/request/RequestTable";
import EditRequestModal from "../../components/admin/request/EditRequestModal";
import bloodRequestService from "../../services/bloodRequestService";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

function ManageRequests() {
  const location = useLocation();

  // Load initial filters from localStorage if present
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState(localStorage.getItem("filter_request_bg") || "");
  const [emergencyLevel, setEmergencyLevel] = useState(localStorage.getItem("filter_request_emergency") || "");
  const [requestStatus, setRequestStatus] = useState(localStorage.getItem("filter_request_status") || "");

  // Persistence of filters
  useEffect(() => {
    localStorage.setItem("filter_request_bg", bloodGroup);
    localStorage.setItem("filter_request_emergency", emergencyLevel);
    localStorage.setItem("filter_request_status", requestStatus);
  }, [bloodGroup, emergencyLevel, requestStatus]);

  // Search Debouncer (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editRequest, setEditRequest] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    type: "danger",
  });

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bloodRequestService.getAllRequests();
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setRequests(list);
    } catch (error) {
      console.error("Failed to load requests", error);
      toast.error("Failed to fetch blood request records.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    if (location.state?.addOpen || new URLSearchParams(location.search).get("add") === "true") {
      setAddOpen(true);
    }
  }, [location]);

  // Reset page number on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, bloodGroup, emergencyLevel, requestStatus]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter Logic
  const filteredRequests = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return requests.filter((req) => {
      const matchesSearch =
        !query ||
        req.patientName?.toLowerCase().includes(query) ||
        req.requestNumber?.toLowerCase().includes(query) ||
        req.remarks?.toLowerCase().includes(query) ||
        req.bloodGroup?.toLowerCase().replace("_", " ").includes(query);

      const matchesBloodGroup = !bloodGroup || req.bloodGroup === bloodGroup;
      const matchesEmergency = !emergencyLevel || req.emergencyLevel === emergencyLevel;
      const matchesStatus = !requestStatus || req.requestStatus === requestStatus;

      return matchesSearch && matchesBloodGroup && matchesEmergency && matchesStatus;
    });
  }, [requests, debouncedSearch, bloodGroup, emergencyLevel, requestStatus]);

  // Sorting Logic
  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "patientName") {
        aVal = a.patientName || "";
        bVal = b.patientName || "";
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
    });
  }, [filteredRequests, sortField, sortOrder]);

  // Pagination Logic
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRequests.slice(start, start + pageSize);
  }, [sortedRequests, currentPage, pageSize]);

  const openDetails = async (req) => {
    try {
      const reqDetails = await bloodRequestService.getRequest(req.id);
      setSelectedRequest(reqDetails);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Failed to load request details", error);
      toast.error("Failed to fetch request details.");
    }
  };

  const openEdit = async (req) => {
    try {
      const reqDetails = await bloodRequestService.getRequest(req.id);
      setEditRequest(reqDetails);
      setEditOpen(true);
    } catch (error) {
      console.error("Failed to load request details", error);
      toast.error("Failed to fetch request details.");
    }
  };

  // Status trigger click
  const handleStatusClick = (requestId, action, title, message, successToast) => {
    setConfirmConfig({
      title,
      message,
      type: "warning",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          if (action === "approve") {
            await bloodRequestService.approveRequest(requestId);
          } else if (action === "reject") {
            await bloodRequestService.rejectRequest(requestId);
          } else if (action === "complete") {
            await bloodRequestService.completeRequest(requestId);
          } else if (action === "cancel") {
            await bloodRequestService.cancelRequest(requestId);
          }
          toast.success(successToast);
          await loadRequests();
        } catch (error) {
          console.error(`Failed to ${action} request`, error);
          const errorMsg = error.response?.data?.message || `Unable to ${action} blood request.`;
          toast.error(errorMsg);
        }
      },
    });
    setConfirmOpen(true);
  };

  // Delete click triggers ConfirmationModal
  const handleDeleteClick = (requestId) => {
    setConfirmConfig({
      title: "Delete Blood Request",
      message: "Are you sure you want to delete this blood request? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await bloodRequestService.deleteRequest(requestId);
          toast.success("Blood request deleted successfully.");
          await loadRequests();
        } catch (error) {
          console.error("Failed to delete request", error);
          toast.error("Failed to delete blood request. Please try again.");
        }
      },
    });
    setConfirmOpen(true);
  };

  // Clear all filters helper
  const handleClearFilters = () => {
    setBloodGroup("");
    setEmergencyLevel("");
    setRequestStatus("");
    setSearch("");
  };

  // Determine active chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (bloodGroup) chips.push({ label: `Group: ${bloodGroup.replace("_", " ")}`, clear: () => setBloodGroup("") });
    if (emergencyLevel) chips.push({ label: `Emergency: ${emergencyLevel}`, clear: () => setEmergencyLevel("") });
    if (requestStatus) chips.push({ label: `Status: ${requestStatus}`, clear: () => setRequestStatus("") });
    return chips;
  }, [bloodGroup, emergencyLevel, requestStatus]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Blood Requests</h1>
          <p className="mt-2 text-gray-500">Manage all emergency blood requests.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadRequests}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh list"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 shadow-sm font-semibold"
          >
            <Plus size={20} /> New Request
          </button>
        </div>
      </div>

      {/* Filters Form Container */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Search Input with Clear Button */}
          <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-50 transition bg-white relative">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requests..."
              className="ml-3 w-full py-3 outline-none bg-transparent text-sm text-slate-800 pr-6"
              aria-label="Search blood requests"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={bloodGroup}
            onChange={(event) => setBloodGroup(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by blood group"
          >
            <option value="">All Blood Groups</option>
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
          </select>

          <select
            value={emergencyLevel}
            onChange={(event) => setEmergencyLevel(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by emergency level"
          >
            <option value="">All Emergency Levels</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            value={requestStatus}
            onChange={(event) => setRequestStatus(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-50">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full pl-3 pr-1.5 py-1 text-xs font-medium"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.clear}
                  className="p-0.5 rounded-full hover:bg-red-100 transition"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main List Grid / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-xl w-full"></div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "No Search Results" : "No Blood Requests Yet"}
          description={
            debouncedSearch
              ? `We couldn't find any blood requests matching "${debouncedSearch}". Try checking your spelling or sorting parameters.`
              : "There are no emergency blood requests registered matching these filter properties."
          }
          icon={ClipboardList}
          actionText={debouncedSearch || activeChips.length > 0 ? "Clear Filters" : "Create a Blood Request"}
          onAction={debouncedSearch || activeChips.length > 0 ? handleClearFilters : () => setAddOpen(true)}
        />
      ) : (
        <>
          <RequestTable
            requests={paginatedRequests}
            onView={openDetails}
            onEdit={openEdit}
            onDeleteClick={handleDeleteClick}
            onStatusClick={handleStatusClick}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

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

      {/* Modals */}
      <AddRequestModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => {
          loadRequests();
          toast.success("New emergency request created successfully.");
        }}
      />

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedRequest(null);
          }}
          onRefresh={loadRequests}
        />
      )}

      {editRequest && (
        <EditRequestModal
          request={editRequest}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditRequest(null);
          }}
          onUpdated={() => {
            loadRequests();
            toast.success("Blood request details updated successfully.");
          }}
        />
      )}
    </>
  );
}

export default ManageRequests;