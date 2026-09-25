import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, X, Users, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import AddDonorModal from "../../components/admin/donor/AddDonorModal";
import DonorDetailsModal from "../../components/admin/donor/DonorDetailsModal";
import DonorTable from "../../components/admin/donor/DonorTable";
import EditDonorModal from "../../components/admin/donor/EditDonorModal";
import studentDonorService from "../../services/studentDonorService";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

function ManageDonors() {
  const location = useLocation();

  // Load initial filters from localStorage if present
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState(localStorage.getItem("filter_donor_bg") || "");
  const [availability, setAvailability] = useState(localStorage.getItem("filter_donor_avail") || "");
  const [verifiedFilter, setVerifiedFilter] = useState(localStorage.getItem("filter_donor_verified") || "");
  const [activeFilter, setActiveFilter] = useState(localStorage.getItem("filter_donor_active") || "");

  // Persistence of filters
  useEffect(() => {
    localStorage.setItem("filter_donor_bg", bloodGroup);
    localStorage.setItem("filter_donor_avail", availability);
    localStorage.setItem("filter_donor_verified", verifiedFilter);
    localStorage.setItem("filter_donor_active", activeFilter);
  }, [bloodGroup, availability, verifiedFilter, activeFilter]);

  // Search Debouncer (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [editDonor, setEditDonor] = useState(null);
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

  const loadDonors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await studentDonorService.getAllDonors();
      const donorList = Array.isArray(response) ? response : response?.data ?? [];
      setDonors(donorList);
    } catch (error) {
      console.error("Failed to load donors", error);
      toast.error("Failed to fetch donor records.");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonors();
  }, [loadDonors]);

  useEffect(() => {
    if (location.state?.addOpen || new URLSearchParams(location.search).get("add") === "true") {
      setAddOpen(true);
    }
  }, [location]);

  // Reset page number on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, bloodGroup, availability, verifiedFilter, activeFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter Logic
  const filteredDonors = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return donors.filter((donor) => {
      const matchesSearch =
        !query ||
        donor.fullName?.toLowerCase().includes(query) ||
        donor.email?.toLowerCase().includes(query) ||
        donor.mobileNumber?.toLowerCase().includes(query) ||
        donor.studentId?.toLowerCase().includes(query) ||
        donor.collegeName?.toLowerCase().includes(query);

      const matchesBloodGroup = !bloodGroup || donor.bloodGroup === bloodGroup;
      const matchesAvailability =
        !availability ||
        (availability === "available" && donor.availableToDonate) ||
        (availability === "unavailable" && !donor.availableToDonate);
      const matchesVerified =
        !verifiedFilter ||
        (verifiedFilter === "verified" && donor.verified) ||
        (verifiedFilter === "pending" && !donor.verified);
      const matchesActive =
        !activeFilter ||
        (activeFilter === "active" && donor.active) ||
        (activeFilter === "inactive" && !donor.active);

      return (
        matchesSearch &&
        matchesBloodGroup &&
        matchesAvailability &&
        matchesVerified &&
        matchesActive
      );
    });
  }, [donors, debouncedSearch, bloodGroup, availability, verifiedFilter, activeFilter]);

  // Sorting Logic
  const sortedDonors = useMemo(() => {
    return [...filteredDonors].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "fullName") {
        aVal = a.fullName || "";
        bVal = b.fullName || "";
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
  }, [filteredDonors, sortField, sortOrder]);

  // Pagination Logic
  const paginatedDonors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDonors.slice(start, start + pageSize);
  }, [sortedDonors, currentPage, pageSize]);

  const openDetails = async (donor) => {
    try {
      const donorDetails = await studentDonorService.getDonor(donor.id);
      setSelectedDonor(donorDetails);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Failed to load donor details", error);
      toast.error("Failed to fetch donor details.");
    }
  };

  const openEdit = async (donor) => {
    try {
      const donorDetails = await studentDonorService.getDonor(donor.id);
      setEditDonor(donorDetails);
      setEditOpen(true);
    } catch (error) {
      console.error("Failed to load donor", error);
      toast.error("Failed to fetch donor details.");
    }
  };

  // Delete click triggers ConfirmationModal
  const handleDeleteClick = (donorId) => {
    setConfirmConfig({
      title: "Delete Donor",
      message: "Are you sure you want to delete this donor account? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await studentDonorService.deleteDonor(donorId);
          toast.success("Donor account deleted successfully.");
          await loadDonors();
        } catch (error) {
          console.error("Failed to delete donor", error);
          toast.error("Failed to delete donor. Please try again.");
        }
      },
    });
    setConfirmOpen(true);
  };

  // Clear all filters helper
  const handleClearFilters = () => {
    setBloodGroup("");
    setAvailability("");
    setVerifiedFilter("");
    setActiveFilter("");
    setSearch("");
  };

  // Determine active chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (bloodGroup) chips.push({ label: `Group: ${bloodGroup.replace("_", " ")}`, clear: () => setBloodGroup("") });
    if (availability) chips.push({ label: `Availability: ${availability}`, clear: () => setAvailability("") });
    if (verifiedFilter) chips.push({ label: `Verification: ${verifiedFilter}`, clear: () => setVerifiedFilter("") });
    if (activeFilter) chips.push({ label: `Status: ${activeFilter}`, clear: () => setActiveFilter("") });
    return chips;
  }, [bloodGroup, availability, verifiedFilter, activeFilter]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Donors</h1>
          <p className="mt-2 text-gray-500">View and manage all registered blood donors.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadDonors}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh list"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 shadow-sm font-semibold"
          >
            <Plus size={20} /> Add Donor
          </button>
        </div>
      </div>

      {/* Filters Form Container */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {/* Search Input with Clear Button */}
          <div className="flex items-center rounded-xl border border-slate-200 px-4 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-50 transition bg-white relative">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search donors..."
              className="ml-3 w-full py-3 outline-none bg-transparent text-sm text-slate-800 pr-6"
              aria-label="Search blood donors"
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
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by availability"
          >
            <option value="">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            value={verifiedFilter}
            onChange={(event) => setVerifiedFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by verification status"
          >
            <option value="">All Verification</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 bg-white text-sm text-slate-700 outline-none focus:border-red-500 transition"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
      ) : filteredDonors.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "No Search Results" : "No Donors Found"}
          description={
            debouncedSearch
              ? `We couldn't find any donors matching "${debouncedSearch}". Try checking your spelling or sorting parameters.`
              : "There are no student donors registered matching these filter properties."
          }
          icon={Users}
          actionText={debouncedSearch || activeChips.length > 0 ? "Clear Filters" : "Register a Donor"}
          onAction={debouncedSearch || activeChips.length > 0 ? handleClearFilters : () => setAddOpen(true)}
        />
      ) : (
        <>
          <DonorTable
            donors={paginatedDonors}
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
            totalItems={filteredDonors.length}
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
      <AddDonorModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => {
          loadDonors();
          toast.success("New donor registered successfully.");
        }}
      />

      {selectedDonor && (
        <DonorDetailsModal
          donor={selectedDonor}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedDonor(null);
          }}
          onRefresh={loadDonors}
        />
      )}

      {editDonor && (
        <EditDonorModal
          donor={editDonor}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditDonor(null);
          }}
          onUpdated={() => {
            loadDonors();
            toast.success("Donor details updated successfully.");
          }}
        />
      )}
    </>
  );
}

export default ManageDonors;
