import { useEffect, useState } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import bloodRequestService from "../../../services/bloodRequestService";
import patientService from "../../../services/patientService";

const initialFormData = {
  patientId: "",
  bloodGroup: "",
  unitsRequired: "",
  emergencyLevel: "",
  requiredDate: "",
  remarks: "",
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

function EditRequestModal({ request, open, onClose, onUpdated }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setValidationError("");
      const fetchPatients = async () => {
        try {
          setLoadingPatients(true);
          const response = await patientService.getAllPatients();
          const list = Array.isArray(response) ? response : response?.data ?? [];
          setPatients(list);
        } catch (error) {
          console.error("Failed to load patients", error);
        } finally {
          setLoadingPatients(false);
        }
      };
      fetchPatients();
    }
  }, [open]);

  useEffect(() => {
    if (!request) {
      return;
    }

    setFormData({
      patientId: request.patientId || "",
      bloodGroup: request.bloodGroup || "",
      unitsRequired: request.unitsRequired ?? "",
      emergencyLevel: request.emergencyLevel || "",
      requiredDate: request.requiredDate ? request.requiredDate.split("T")[0] : "",
      remarks: request.remarks || "",
    });
  }, [request]);

  if (!open || !request) {
    return null;
  }

  const filteredPatients = patients.filter((p) => {
    const term = patientSearch.trim().toLowerCase();
    return (
      !term ||
      p.patientName?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.id?.toString().includes(term)
    );
  });

  const handleSelectPatient = (p) => {
    setFormData((prev) => ({
      ...prev,
      patientId: p.id,
      bloodGroup: p.bloodGroup || prev.bloodGroup,
    }));
    setPatientSearch("");
    setDropdownOpen(false);
  };

  const selectedPatient = patients.find((p) => p.id === Number(formData.patientId));
  const selectedLabel = selectedPatient
    ? `${selectedPatient.patientName} (ID: ${selectedPatient.id}, Blood: ${selectedPatient.bloodGroup})`
    : request.patientName
    ? `${request.patientName} (ID: ${request.patientId})`
    : "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setValidationError("");
  };

  const validateForm = () => {
    const units = Number(formData.unitsRequired);

    if (!formData.patientId) {
      return "Patient selection is required.";
    }

    if (units <= 0) {
      return "Units Required must be greater than zero.";
    }

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
        patientId: Number(formData.patientId),
        unitsRequired: Number(formData.unitsRequired),
      };

      await bloodRequestService.updateRequest(request.id, payload);
      await onUpdated();

      onClose();
      toast.success("Blood request updated successfully.");
    } catch (error) {
      console.error("Failed to update blood request", error);

      const data = error.response?.data;
      let errorMsg = "Unable to update blood request.";
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
      <div className="flex h-full max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Blood Request</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update blood request details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
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

            <div className="grid gap-5">
              
              {/* Patient Selector */}
              <div className="relative">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Patient
                </span>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                >
                  <span className="truncate">
                    {selectedLabel || (loadingPatients ? "Loading patients..." : "Select a patient...")}
                  </span>
                  <ChevronDown size={18} className="text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 right-0 z-50 mt-2 rounded-xl border border-slate-200 bg-white p-2 shadow-xl max-h-60 overflow-y-auto">
                    <div className="mb-2 flex items-center rounded-lg border px-3 py-2 bg-slate-50">
                      <Search size={16} className="text-gray-400" />
                      <input
                        type="text"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="Search by name, ID or city..."
                        className="ml-2 w-full bg-transparent text-sm outline-none"
                      />
                    </div>
                    {filteredPatients.length === 0 ? (
                      <div className="py-3 text-center text-sm text-gray-500">
                        {loadingPatients ? "Loading..." : "No patients found"}
                      </div>
                    ) : (
                      filteredPatients.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectPatient(p)}
                          className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition"
                        >
                          <span className="text-sm font-semibold text-slate-800">
                            {p.patientName} (ID: {p.id})
                          </span>
                          <span className="text-xs text-slate-500">
                            Blood Group: {p.bloodGroup} | City: {p.city}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
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

                <Input
                  label="Required Date"
                  name="requiredDate"
                  type="date"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Remarks / Notes
                </span>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  maxLength="500"
                  rows="3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  placeholder="Enter request remarks or notes..."
                />
              </label>

            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
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
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRequestModal;
