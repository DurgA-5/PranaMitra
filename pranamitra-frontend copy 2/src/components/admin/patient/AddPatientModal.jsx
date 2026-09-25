import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import patientService from "../../../services/patientService";

const initialFormData = {
  patientName: "",
  gender: "",
  age: "",
  bloodGroup: "",
  unitsRequired: "",
  hospitalName: "",
  doctorName: "",
  attenderName: "",
  attenderMobile: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  requiredDate: "",
  emergencyLevel: "",
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

function AddPatientModal({ open, onClose, onAdded }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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
    const units = Number(formData.unitsRequired);
    const mobile = (formData.attenderMobile || "").trim();

    if (!mobile || !/^[6-9][0-9]{9}$/.test(mobile)) {
      return "Phone Number must be exactly 10 digits and start with a digit between 6 and 9.";
    }

    if (age <= 0) {
      return "Age must be greater than zero.";
    }

    if (units <= 0) {
      return "Units Required must be greater than zero.";
    }

    // Required Date must be in the future or today
    if (formData.requiredDate) {
      const selectedDate = new Date(formData.requiredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return "Required Date must be today or a future date.";
      }
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
        unitsRequired: formData.unitsRequired ? Number(formData.unitsRequired) : null,
      };

      await patientService.createPatient(payload);
      await onAdded();

      resetForm();
      onClose();
      toast.success("Patient request added successfully.");
    } catch (error) {
      console.error("Failed to add patient request", error);

      const data = error.response?.data;
      let errorMsg = "Unable to add patient request.";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex h-full max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add Patient Request</h2>
            <p className="mt-1 text-sm text-slate-500">
              Create a new patient blood request.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="overflow-y-auto px-6 py-5">
            {validationError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {validationError}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Patient Full Name"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
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
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
              />

              <Select
                label="Blood Group Required"
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
                label="Units Required"
                name="unitsRequired"
                type="number"
                value={formData.unitsRequired}
                onChange={handleChange}
                required
                min="1"
              />

              <Input
                label="Hospital Name"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
              />

              <Input
                label="Doctor Name"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
              />

              <Input
                label="Attender Name"
                name="attenderName"
                value={formData.attenderName}
                onChange={handleChange}
                required
              />

              <Input
                label="Attender Phone Number"
                name="attenderMobile"
                type="tel"
                value={formData.attenderMobile}
                onChange={handleChange}
                required
              />

              <Input
                label="Required Date"
                name="requiredDate"
                type="date"
                value={formData.requiredDate}
                onChange={handleChange}
                required
              />

              <Select
                label="Emergency Level"
                name="emergencyLevel"
                value={formData.emergencyLevel}
                onChange={handleChange}
                required
                options={[
                  { value: "LOW", label: "Low" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HIGH", label: "High" },
                  { value: "CRITICAL", label: "Critical" },
                ]}
              />

              <div className="md:col-span-2">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

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
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
            >
              {submitting ? "Adding..." : "Add Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatientModal;
