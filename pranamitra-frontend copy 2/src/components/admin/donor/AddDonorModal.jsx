import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import studentDonorService from "../../../services/studentDonorService";

const initialFormData = {
  fullName: "",
  email: "",
  mobileNumber: "",
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
  availableToDonate: true,
};

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  max,
}) {
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
        min={min}
        max={max}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, required = false }) {
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

function AddDonorModal({ open, onClose, onAdded }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setValidationError("");
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setValidationError("");
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onClose();
    }
  };

  const validateForm = () => {
    const age = Number(formData.age);
    const weight = Number(formData.weight);
    const phone = (formData.mobileNumber || "").trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      return "Phone Number must be exactly 10 digits.";
    }

    if (age < 18 || age > 65) {
      return "Age must be between 18 and 65.";
    }

    if (weight <= 0) {
      return "Weight must be greater than zero.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      setValidationError(errorMessage);
      return;
    }

    try {
      setSubmitting(true);
      setValidationError("");

      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : null,
        weight: formData.weight ? Number(formData.weight) : null,
        lastDonationDate: formData.lastDonationDate || null,
      };

      await studentDonorService.createDonor(payload);
      await onAdded();

      resetForm();
      onClose();
      toast.success("Donor added successfully.");
    } catch (error) {
      console.error("Failed to add donor", error);

      const data = error.response?.data;
      let errorMsg = "Unable to add donor.";
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
            <h2 className="text-xl font-bold text-slate-800">Add Donor</h2>
            <p className="mt-1 text-sm text-slate-500">
              Create a new student blood donor record.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close add donor modal"
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
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Phone Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />

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
                required
                min="18"
                max="65"
              />

              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
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
                required
                min="1"
              />

              <Input
                label="College Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
              />

              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />

              <Input
                label="Year Of Study"
                name="yearOfStudy"
                type="number"
                value={formData.yearOfStudy}
                onChange={handleChange}
                required
                min="1"
              />

              <Input
                label="Student ID"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
              />

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
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
              onClick={handleClose}
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
              {submitting ? "Adding..." : "Add Donor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDonorModal;