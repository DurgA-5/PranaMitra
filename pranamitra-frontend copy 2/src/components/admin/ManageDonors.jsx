import { useEffect, useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DonorTable from "../../components/admin/donor/DonorTable";
import studentDonorService from "../../services/studentDonorService";

function AddDonorModal({ open, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    bloodGroup: "",
    city: "",
    availableToDonate: true,
  });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      await studentDonorService.addDonor(formData);
      await onRefresh();
      onClose();
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        bloodGroup: "",
        city: "",
        availableToDonate: true,
      });
    } catch (error) {
      console.error("Failed to add donor", error);
      alert("Unable to add donor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Add Donor</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />

          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />

          <input
            required
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />

          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />

          <select
            required
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select Blood Group</option>
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
          </select>

          <label className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              name="availableToDonate"
              checked={formData.availableToDonate}
              onChange={handleChange}
            />
            Available to donate
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-3 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Donor"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ManageDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [availability, setAvailability] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const response = await studentDonorService.getAllDonors();
      setDonors(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to load donors", error);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return donors.filter((donor) => {
      const matchesSearch =
        !normalizedSearch ||
        donor.fullName?.toLowerCase().includes(normalizedSearch) ||
        donor.email?.toLowerCase().includes(normalizedSearch) ||
        donor.mobileNumber?.toLowerCase().includes(normalizedSearch);

      const matchesBloodGroup =
        !bloodGroup || donor.bloodGroup === bloodGroup;

      const matchesAvailability =
        !availability ||
        (availability === "available" && donor.availableToDonate) ||
        (availability === "unavailable" && !donor.availableToDonate);

      return matchesSearch && matchesBloodGroup && matchesAvailability;
    });
  }, [donors, search, bloodGroup, availability]);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Donors</h1>
          <p className="mt-2 text-gray-500">
            View, search, and manage all registered blood donors.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700"
        >
          <Plus size={20} />
          Add Donor
        </button>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center rounded-xl border px-4">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, or mobile..."
              className="ml-3 w-full py-3 outline-none"
            />
          </div>

          <select
            value={bloodGroup}
            onChange={(event) => setBloodGroup(event.target.value)}
            className="rounded-xl border px-4 py-3"
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
            className="rounded-xl border px-4 py-3"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white py-10 text-center text-gray-500 shadow-md">
          Loading donors...
        </div>
      ) : (
        <DonorTable
          donors={filteredDonors}
          onRefresh={loadDonors}
          onDonorUpdated={loadDonors}
          onDonorDeleted={loadDonors}
        />
      )}

      <AddDonorModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={loadDonors}
      />
    </DashboardLayout>
  );
}

export default ManageDonors;