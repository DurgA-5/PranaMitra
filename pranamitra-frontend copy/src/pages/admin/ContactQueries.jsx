import { useEffect, useState, useMemo } from "react";
import { Search, X, Eye, Trash2, Calendar, RefreshCw, Mail, User, Info, MessageSquare, Tag } from "lucide-react";
import { toast } from "react-toastify";
import contactService from "../../services/contactService";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

function ContactQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Search & Filters State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting State
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Action States
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteQueryId, setDeleteQueryId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch queries
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllQueries();
      setQueries(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load contact queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [refreshKey]);

  // Search Debouncer (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await contactService.updateStatus(id, newStatus);
      setQueries((prev) => prev.map((q) => (q.id === id ? updated : q)));
      if (selectedQuery && selectedQuery.id === id) {
        setSelectedQuery(updated);
      }
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deleteQueryId) return;
    try {
      await contactService.deleteQuery(deleteQueryId);
      setQueries((prev) => prev.filter((q) => q.id !== deleteQueryId));
      if (selectedQuery && selectedQuery.id === deleteQueryId) {
        setViewModalOpen(false);
      }
      toast.success("Contact query deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete contact query.");
    } finally {
      setDeleteModalOpen(false);
      setDeleteQueryId(null);
    }
  };

  // Filter & Search Logic
  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      // Search match (name, email, subject)
      const matchesSearch =
        debouncedSearch.trim() === "" ||
        q.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.subject?.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Status match
      const matchesStatus = statusFilter === "" || q.status === statusFilter;

      // Date Range match
      let matchesDate = true;
      if (q.createdAt) {
        const queryDate = new Date(q.createdAt);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (queryDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (queryDate > end) matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [queries, debouncedSearch, statusFilter, startDate, endDate]);

  // Sorting Logic
  const sortedQueries = useMemo(() => {
    return [...filteredQueries].sort((a, b) => {
      let aVal = a[sortField] || "";
      let bVal = b[sortField] || "";

      if (sortField === "createdAt") {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredQueries, sortField, sortOrder]);

  // Pagination Logic
  const paginatedQueries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedQueries.slice(startIndex, startIndex + pageSize);
  }, [sortedQueries, currentPage, pageSize]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, startDate, endDate, pageSize]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "NEW":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "CLOSED":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            📨 Contact Queries
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Manage inquiries, feedback, and support tickets submitted by visitors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters & Search section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm font-semibold placeholder-slate-400 focus:outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status selector */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-500 focus:outline-none text-sm font-semibold text-slate-600"
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Clear Button */}
          <div className="flex items-center">
            {(search || statusFilter || startDate || endDate) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/50 px-4 py-3 rounded-xl transition w-full md:w-auto"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Date Range Sub-row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <Calendar size={14} /> Date Range:
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 focus:outline-none focus:border-red-500"
              aria-label="Start Date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 focus:outline-none focus:border-red-500"
              aria-label="End Date"
            />
          </div>
        </div>
      </div>

      {/* Main Table section */}
      {loading ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl" />
          ))}
        </div>
      ) : sortedQueries.length === 0 ? (
        <EmptyState
          title="No Contact Queries"
          description="We couldn't find any inquiries matching your filters or search options."
          icon={Mail}
        />
      ) : (
        <>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden select-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("fullName")}>
                      Name {sortField === "fullName" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="py-4 px-6 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("email")}>
                      Email {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="py-4 px-6">Subject</th>
                    <th className="py-4 px-6 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("createdAt")}>
                      Date {sortField === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="py-4 px-6 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("status")}>
                      Status {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                  {paginatedQueries.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{q.fullName}</td>
                      <td className="py-4 px-6">{q.email}</td>
                      <td className="py-4 px-6 max-w-xs truncate">{q.subject}</td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-xs">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, {
                          dateStyle: "medium"
                        }) : "N/A"}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${getStatusBadge(q.status)}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedQuery(q);
                              setViewModalOpen(true);
                            }}
                            title="View details"
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteQueryId(q.id);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete query"
                            className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 size={16} />
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
            totalItems={sortedQueries.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* View Detail Modal */}
      {viewModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                <Mail size={18} className="text-red-500" /> Enquiry Details
              </h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={13} /> Sender Name
                  </span>
                  <p className="font-bold text-slate-800">{selectedQuery.fullName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={13} /> Email Address
                  </span>
                  <p className="font-bold text-slate-800">{selectedQuery.email}</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info size={13} /> Subject
                </span>
                <p className="font-bold text-slate-800">{selectedQuery.subject}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare size={13} /> Message
                </span>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 font-semibold text-slate-600 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedQuery.message}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted Date</span>
                  <p className="font-semibold text-slate-600 font-mono text-xs">
                    {selectedQuery.createdAt ? new Date(selectedQuery.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Status</span>
                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-block mt-0.5 ${getStatusBadge(selectedQuery.status)}`}>
                      {selectedQuery.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag size={13} /> Admin Actions
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold mr-2">Mark status:</span>
                  {["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(selectedQuery.id, status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        selectedQuery.status === status
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteQueryId(selectedQuery.id);
                      setDeleteModalOpen(true);
                    }}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={13} /> Delete Query
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={deleteModalOpen}
        title="Delete Contact Query"
        message="Are you sure you want to permanently delete this contact query? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteQueryId(null);
        }}
        type="danger"
      />
    </>
  );
}

export default ContactQueries;
