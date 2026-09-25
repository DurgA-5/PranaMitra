import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Search, X, HeartHandshake, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import AddPatientModal from "../../components/admin/patient/AddPatientModal";
import PatientDetailsModal from "../../components/admin/patient/PatientDetailsModal";
import PatientTable from "../../components/admin/patient/PatientTable";
import EditPatientModal from "../../components/admin/patient/EditPatientModal";
import patientService from "../../services/patientService";

import ConfirmationModal from "../../components/common/ConfirmationModal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";

function ManagePatients() {
  const location = useLocation();

  // Load initial filters from localStorage if present
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState(localStorage.getItem("filter_patient_bg") || "");
  const [emergencyLevel, setEmergencyLevel] = useState(localStorage.getItem("filter_patient_emergency") || "");
  const [requestStatus, setRequestStatus] = useState(localStorage.getItem("filter_patient_status") || "");
  const [cityFilter, setCityFilter] = useState(localStorage.getItem("filter_patient_city") || "");

  // Persistence of filters
  useEffect(() => {
    localStorage.setItem("filter_patient_bg", bloodGroup);
    localStorage.setItem("filter_patient_emergency", emergencyLevel);
    localStorage.setItem("filter_patient_status", requestStatus);
    localStorage.setItem("filter_patient_city", cityFilter);
  }, [bloodGroup, emergencyLevel, requestStatus, cityFilter]);

  // Search Debouncer (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sorting State
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal States
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState(null);
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

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatients();
      const patientList = Array.isArray(response) ? response : response?.data ?? [];
      setPatients(patientList);
    } catch (error) {
      console.error("Failed to load patients", error);
      toast.error("Failed to fetch patient records.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    if (location.state?.addOpen || new URLSearchParams(location.search).get("add") === "true") {
      setAddOpen(true);
    }
  }, [location]);

  // Reset page number on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, bloodGroup, emergencyLevel, requestStatus, cityFilter]);

  // Extract unique cities list
  const cities = useMemo(() => {
    const unique = new Set(patients.map((p) => p.city).filter(Boolean));
    return Array.from(unique).sort();
  }, [patients]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter Logic
  const filteredPatients = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesSearch =
        !query ||
        patient.patientName?.toLowerCase().includes(query) ||
        patient.attenderMobile?.toLowerCase().includes(query) ||
        patient.hospitalName?.toLowerCase().includes(query) ||
        patient.bloodGroup?.toLowerCase().replace("_", " ").includes(query);

      const matchesBloodGroup = !bloodGroup || patient.bloodGroup === bloodGroup;
      const matchesEmergency = !emergencyLevel || patient.emergencyLevel === emergencyLevel;
      const matchesStatus = !requestStatus || patient.requestStatus === requestStatus;
      const matchesCity = !cityFilter || patient.city === cityFilter;

      return (
        matchesSearch &&
        matchesBloodGroup &&
        matchesEmergency &&
        matchesStatus &&
        matchesCity
      );
    });
  }, [patients, debouncedSearch, bloodGroup, emergencyLevel, requestStatus, cityFilter]);

  // Sorting Logic
  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
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
  }, [filteredPatients, sortField, sortOrder]);

  // Pagination Logic
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPatients.slice(start, start + pageSize);
  }, [sortedPatients, currentPage, pageSize]);

  const openDetails = async (patient) => {
    try {
      const patientDetails = await patientService.getPatient(patient.id);
      setSelectedPatient(patientDetails);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Failed to load patient details", error);
      toast.error("Failed to fetch patient details.");
    }
  };

  const openEdit = async (patient) => {
    try {
      const patientDetails = await patientService.getPatient(patient.id);
      setEditPatient(patientDetails);
      setEditOpen(true);
    } catch (error) {
      console.error("Failed to load patient details", error);
      toast.error("Failed to fetch patient details.");
    }
  };

  // Delete click triggers ConfirmationModal
  const handleDeleteClick = (patientId) => {
    setConfirmConfig({
      title: "Delete Patient Request",
      message: "Are you sure you want to delete this patient request record? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          await patientService.deletePatient(patientId);
          toast.success("Patient request record deleted successfully.");
          await loadPatients();
        } catch (error) {
          console.error("Failed to delete patient", error);
          toast.error("Failed to delete patient request. Please try again.");
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
    setCityFilter("");
    setSearch("");
  };

  // Determine active chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (bloodGroup) chips.push({ label: `Group: ${bloodGroup.replace("_", " ")}`, clear: () => setBloodGroup("") });
    if (emergencyLevel) chips.push({ label: `Emergency: ${emergencyLevel}`, clear: () => setEmergencyLevel("") });
    if (requestStatus) chips.push({ label: `Status: ${requestStatus}`, clear: () => setRequestStatus("") });
    if (cityFilter) chips.push({ label: `City: ${cityFilter}`, clear: () => setCityFilter("") });
    return chips;
  }, [bloodGroup, emergencyLevel, requestStatus, cityFilter]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Patients</h1>
          <p className="mt-2 text-gray-500">View and manage all registered patient requests.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadPatients}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh list"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white transition hover:bg-red-700 shadow-sm font-semibold"
          >
            <Plus size={20} /> Add Patient
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
              placeholder="Search patients..."
              className="ml-3 w-full py-3 outline-none bg-transparent text-sm text-slate-800 pr-6"
              aria-label="Search patients"
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
            aria-label="Filter by request status"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
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
      ) : filteredPatients.length === 0 ? (
        <EmptyState
          title={debouncedSearch ? "No Search Results" : "No Patients Found"}
          description={
            debouncedSearch
              ? `We couldn't find any patients matching "${debouncedSearch}". Try checking your spelling or sorting parameters.`
              : "There are no patient request records registered matching these filter properties."
          }
          icon={HeartHandshake}
          actionText={debouncedSearch || activeChips.length > 0 ? "Clear Filters" : "Register a Patient"}
          onAction={debouncedSearch || activeChips.length > 0 ? handleClearFilters : () => setAddOpen(true)}
        />
      ) : (
        <>
          <PatientTable
            patients={paginatedPatients}
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
            totalItems={filteredPatients.length}
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
      <AddPatientModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => {
          loadPatients();
          toast.success("New patient request registered successfully.");
        }}
      />

      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          open={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedPatient(null);
          }}
        />
      )}

      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditPatient(null);
          }}
          onUpdated={() => {
            loadPatients();
            toast.success("Patient details updated successfully.");
          }}
        />
      )}
    </>
  );
}

export default ManagePatients;