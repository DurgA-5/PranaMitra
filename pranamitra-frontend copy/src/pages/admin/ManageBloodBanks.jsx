import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, X, Building, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import BloodBankTable from "../../components/admin/bloodbank/BloodBankTable";
import AddBloodBankModal from "../../components/admin/bloodbank/AddBloodBankModal";
import EditBloodBankModal from "../../components/admin/bloodbank/EditBloodBankModal";
import BloodBankDetailsModal from "../../components/admin/bloodbank/BloodBankDetailsModal";
import bloodBankService from "../../services/bloodBankService";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

function ManageBloodBanks() {
  const location = useLocation();

  // Load initial filters from localStorage if present
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(localStorage.getItem("filter_bank_status") || "");
  const [hoursFilter, setHoursFilter] = useState(localStorage.getItem("filter_bank_hours") || "");
  const [cityFilter, setCityFilter] = useState(localStorage.getItem("filter_bank_city") || "");

  // Persistence of filters
  useEffect(() => {
    localStorage.setItem("filter_bank_status", statusFilter);
    localStorage.setItem("filter_bank_hours", hoursFilter);
    localStorage.setItem("filter_bank_city", cityFilter);
  }, [statusFilter, hoursFilter, cityFilter]);

  // Search Debouncer (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [selectedBank, setSelectedBank] = useState(null);
  const [editBank, setEditBank] = useState(null);
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

  const loadBloodBanks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bloodBankService.getAllBloodBanks();
      const list = Array.isArray(response) ? response : response?.data ?? [];
      setBloodBanks(list);
    } catch (error) {
      console.error("Failed to load blood banks", error);
      toast.error("Failed to fetch blood bank records.");
      setBloodBanks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBloodBanks();
  }, [loadBloodBanks]);

  useEffect(() => {
    if (location.state?.addOpen || new URLSearchParams(location.search).get("add") === "true") {
      setAddOpen(true);
    }
  }, [location]);

  // Reset page number on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, hoursFilter, cityFilter]);

  // Extract unique cities list
  const cities = useMemo(() => {
    const unique = new Set(bloodBanks.map((b) => b.city).filter(Boolean));
    return Array.from(unique).sort();
  }, [bloodBanks]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter Logic
  const filteredBloodBanks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return bloodBanks.filter((bank) => {
      const matchesSearch =
        !query ||
        bank.bloodBankName?.toLowerCase().includes(query) ||
        bank.licenseNumber?.toLowerCase().includes(query) ||
        bank.email?.toLowerCase().includes(query) ||
        bank.mobileNumber?.toLowerCase().includes(query) ||
        bank.managerName?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "active" && bank.active) ||
        (statusFilter === "inactive" && !bank.active);

      const matchesHours =
        hoursFilter === "" ||
        (hoursFilter === "24hours" && bank.available24Hours) ||
        (hoursFilter === "scheduled" && !bank.available24Hours);

      const matchesCity = !cityFilter || bank.city === cityFilter;

      return matchesSearch && matchesStatus && matchesHours && matchesCity;
    });
  }, [bloodBanks, debouncedSearch, statusFilter, hoursFilter, cityFilter]);

  // Sorting Logic
  const sortedBloodBanks = useMemo(() => {
    return [...filteredBloodBanks].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "bloodBankName") {
        aVal = a.bloodBankName || "";
        bVal = b.bloodBankName || "";
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
  }, [filteredBloodBanks, sortField, sortOrder]);

  // Pagination Logic
  const paginatedBloodBanks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBloodBanks.slice(start, start + pageSize);
  }, [sortedBloodBanks, currentPage, pageSize]);

  const openDetails = async (bank) => {
    try {
      const details = await bloodBankService.getBloodBank(bank.id);
      setSelectedBank(details);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Failed to load bank details", error);
      toast.error("Failed to fetch blood bank details.");
    }
  };

  const openEdit = async (bank) => {
    try {
      const details = await bloodBankService.getBloodBank(bank.id);
      setEditBank(details);
      setEditOpen(true);
    } catch (error) {
      console.error("Failed to load bank details", error);
      toast.error("Failed to fetch blood bank details.");
    }
  };

  // Delete click triggers ConfirmationModal
  const handleDeleteClick = (bankId) => {
    setConfirmConfig({
      title: "Delete Blood Bank",
      message: "Are you sure you want to delete this blood bank? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await bloodBankService.deleteBloodBank(bankId);
          toast.success("Blood bank deleted successfully.");
          await loadBloodBanks();
        } catch (error) {
          console.error("Failed to delete blood bank", error);
          toast.error("Failed to delete blood bank. Please try again.");
        }
      },
    });
    setConfirmOpen(true);
  };

  // Clear all filters helper
  const handleClearFilters = () => {
    setStatusFilter("");
    setHoursFilter("");
    setCityFilter("");
    setSearch("");
  };

  // Determine active chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (statusFilter) chips.push({ label: `Status: ${statusFilter}`, clear: () => setStatusFilter("") });
    if (hoursFilter) chips.push({ label: `Hours: ${hoursFilter === "24hours" ? "24 Hours" : "Scheduled"}`, clear: () => setHoursFilter("") });
    if (cityFilter) chips.push({ label: `City: ${cityFilter}`, clear: () => setCityFilter("") });
    return chips;
  }, [statusFilter, hoursFilter, cityFilter]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Blood Banks</h1>
          <p className="mt-2 text-gray-500">Manage registered blood banks and availability.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadBloodBanks}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh list"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 shadow-sm font-semibold"
          >
            <Plus size={20} /> Add Blood Bank
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
              placeholder="Search blood banks..."
              className="ml-3 w-full py-3 outline-none bg-transparent text-sm text-slate-800 pr-6"
              aria-label="Search blood banks"
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
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={hoursFilter}
            onChange={(event) => setHoursFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by hours"
          >
            <option value="">All Operating Hours</option>
            <option value="24hours">24 Hours</option>
            <option value="scheduled">Scheduled Hours</option>
          </select>

          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by city"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
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
      ) : filteredBloodBanks.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "No Search Results" : "No Blood Banks Found"}
          description={
            debouncedSearch
              ? `We couldn't find any blood banks matching "${debouncedSearch}". Try checking your spelling or sorting parameters.`
              : "There are no blood bank facilities registered matching these filter properties."
          }
          icon={Building}
          actionText={debouncedSearch || activeChips.length > 0 ? "Clear Filters" : "Register a Blood Bank"}
          onAction={debouncedSearch || activeChips.length > 0 ? handleClearFilters : () => setAddOpen(true)}
        />
      ) : (
        <>
          <BloodBankTable
            bloodBanks={paginatedBloodBanks}
            onView={openDetails}
            onEdit={openEdit}
            onDeleteClick={handleDeleteClick}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredBloodBanks.length}
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
      <AddBloodBankModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => {
          loadBloodBanks();
          toast.success("New blood bank registered successfully.");
        }}
      />

      {selectedBank && (
        <BloodBankDetailsModal
          bank={selectedBank}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedBank(null);
          }}
        />
      )}

      {editBank && (
        <EditBloodBankModal
          bank={editBank}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditBank(null);
          }}
          onUpdated={() => {
            loadBloodBanks();
            toast.success("Blood bank details updated successfully.");
          }}
        />
      )}
    </>
  );
}

export default ManageBloodBanks;