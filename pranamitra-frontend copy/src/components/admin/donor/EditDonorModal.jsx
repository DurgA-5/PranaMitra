import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import studentDonorService from "../../../services/studentDonorService";

const initialFormData = {
  userId: "",
  bloodGroup: "",
  age: "",
  gender: "",
  weight: "",
  collegeName: "",
  department: "",
  yearOfStudy: "",
  studentId: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  lastDonationDate: "",
  availableToDonate: false,
};

function Input({ label, name, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({ label, name, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-red-600"
      />
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </label>
  );
}

function EditDonorModal({ donor, open, onClose, onUpdated }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (open) {
      setValidationError("");
    }
  }, [open]);

  useEffect(() => {
    if (!donor) {
      return;
    }

    setFormData({
      userId: donor.userId ?? "",
      bloodGroup: donor.bloodGroup || "",
      age: donor.age ?? "",
      gender: donor.gender || "",
      weight: donor.weight ?? "",
      collegeName: donor.collegeName || "",
      department: donor.department || "",
      yearOfStudy: donor.yearOfStudy ?? "",
      studentId: donor.studentId || "",
      address: donor.address || "",
      city: donor.city || "",
      state: donor.state || "",
      pincode: donor.pincode || "",
      lastDonationDate: donor.lastDonationDate
        ? donor.lastDonationDate.split("T")[0]
        : "",
      availableToDonate: Boolean(donor.availableToDonate),
    });
  }, [donor]);

  if (!open || !donor) {
    return null;
  }

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
      setValidationError("");

      const payload = {
        ...formData,
        userId: formData.userId ? Number(formData.userId) : null,
        age: formData.age ? Number(formData.age) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        lastDonationDate: formData.lastDonationDate || null,
      };

      await studentDonorService.updateDonor(donor.id, payload);
      await onUpdated();

      onClose();
      toast.success("Donor updated successfully.");
    } catch (error) {
      console.error("Failed to update donor", error);

      const data = error.response?.data;
      let errorMsg = "Failed to update donor.";
      if (data) {
        if (typeof data === "object") {
          if (data.message) {
            errorMsg = data.message;
          } else if (data.error) {
            errorMsg = data.error;
          } else {
            const fieldErrors = Object.entries(data).map(([field, msg]) => `${field}: ${msg}`);
            if (fieldErrors.length > 0) {
              errorMsg = fieldErrors.join(" | ");
            }
          }
        } else {
          errorMsg = String(data);
        }
      }

      setValidationError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Donor</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update donor profile and donation availability details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close edit donor modal"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="overflow-y-auto px-6 py-5">
            {validationError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {validationError}
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                options={[
                  { value: "A_POSITIVE", label: "A+" },
                  { value: "A_NEGATIVE", label: "A-" },
                  { value: "B_POSITIVE", label: "B+" },
                  { value: "B_NEGATIVE", label: "B-" },
                  { value: "AB_POSITIVE", label: "AB+" },
                  { value: "AB_NEGATIVE", label: "AB-" },
                  { value: "O_POSITIVE", label: "O+" },
                  { value: "O_NEGATIVE", label: "O-" },
                ]}
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
              />

              <Input
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />

              <Input
                label="College Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
              />

              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />

              <Input
                label="Year Of Study"
                name="yearOfStudy"
                type="number"
                value={formData.yearOfStudy}
                onChange={handleChange}
              />

              <Input
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
              />

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />

              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />

              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
              />

              <Input
                label="Last Donation Date"
                name="lastDonationDate"
                type="date"
                value={formData.lastDonationDate}
                onChange={handleChange}
              />

              <Checkbox
                label="Available To Donate"
                name="availableToDonate"
                checked={formData.availableToDonate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDonorModal;
