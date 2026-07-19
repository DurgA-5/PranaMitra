import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import bloodBankService from "../../../services/bloodBankService";

const initialFormData = {
  bloodBankName: "",
  licenseNumber: "",
  email: "",
  mobileNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  managerName: "",
  openingTime: "",
  closingTime: "",
  available24Hours: false,
};

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
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
        disabled={disabled}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50 disabled:text-slate-400"
      />
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

function AddBloodBankModal({ open, onClose, onAdded }) {
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
    const mobile = (formData.mobileNumber || "").trim();
    const pin = (formData.pincode || "").trim();

    if (!mobile || !/^[6-9][0-9]{9}$/.test(mobile)) {
      return "Phone Number must be exactly 10 digits and start with a digit between 6 and 9.";
    }

    if (!pin || !/^[1-9][0-9]{5}$/.test(pin)) {
      return "Pincode must be exactly 6 digits.";
    }

    if (!formData.available24Hours) {
      if (!formData.openingTime || !formData.closingTime) {
        return "Please specify operating times or choose 24 Hours Availability.";
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

      const formatTime = (t) => {
        if (!t) return "00:00:00";
        return t.length === 5 ? `${t}:00` : t;
      };

      const payload = {
        ...formData,
        openingTime: formData.available24Hours ? "00:00:00" : formatTime(formData.openingTime),
        closingTime: formData.available24Hours ? "23:59:00" : formatTime(formData.closingTime),
        available24Hours: Boolean(formData.available24Hours),
      };

      await bloodBankService.createBloodBank(payload);
      await onAdded();

      resetForm();
      onClose();
      toast.success("Blood bank registered successfully.");
    } catch (error) {
      console.error("Failed to add blood bank", error);

      const data = error.response?.data;
      let errorMsg = "Unable to register blood bank.";
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
            <h2 className="text-xl font-bold text-slate-800">Add Blood Bank</h2>
            <p className="mt-1 text-sm text-slate-500">
              Register a new blood bank record.
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
                label="Blood Bank Name"
                name="bloodBankName"
                value={formData.bloodBankName}
                onChange={handleChange}
                required
              />

              <Input
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
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

              <Input
                label="Manager Name"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                required
              />

              <div className="flex flex-col justify-end">
                <Checkbox
                  label="Available 24 Hours"
                  name="available24Hours"
                  checked={formData.available24Hours}
                  onChange={handleChange}
                />
              </div>

              {!formData.available24Hours && (
                <>
                  <Input
                    label="Opening Time"
                    name="openingTime"
                    type="time"
                    value={formData.openingTime}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Closing Time"
                    name="closingTime"
                    type="time"
                    value={formData.closingTime}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

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
              {submitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBloodBankModal;
