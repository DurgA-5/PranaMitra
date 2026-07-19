import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Droplets, CheckCircle, AlertCircle } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";

const BLOOD_GROUPS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
const BLOOD_GROUP_LABELS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

function RequestBlood() {
  const userId = getUserId();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bloodGroup: "",
    unitsRequired: "",
    emergencyLevel: "MEDIUM",
    requiredDate: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.bloodGroup) { toast.error("Please select a blood group."); return false; }
    const units = parseInt(form.unitsRequired, 10);
    if (!form.unitsRequired || isNaN(units) || units < 1) { toast.error("Units required must be at least 1."); return false; }
    if (!form.requiredDate) { toast.error("Please select a required date."); return false; }
    if (form.requiredDate < today) { toast.error("Required date cannot be in the past."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await patientPortalService.createBloodRequest(userId, {
        patientId: null, // will be set by backend from userId
        bloodGroup: form.bloodGroup,
        unitsRequired: parseInt(form.unitsRequired, 10),
        emergencyLevel: form.emergencyLevel,
        requiredDate: form.requiredDate,
        remarks: form.remarks || null,
      });
      setSubmitted(true);
      toast.success("Blood request submitted successfully!");
    } catch (err) {
      console.error("Blood request error:", err?.response?.status, err?.response?.data);
      const data = err?.response?.data;
      // ApiErrorResponse shape: { message: "..." }
      // Validation error shape: { fieldName: "errorMsg", ... }
      const backendMessage =
        data?.message ||
        (data && typeof data === "object" ? Object.values(data).join(". ") : null) ||
        "Failed to submit blood request.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={36} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Request Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your blood request has been successfully submitted. Our team will review it and match a suitable donor.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              New Request
            </button>
            <button
              onClick={() => navigate("/patient/requests")}
              className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition"
            >
              View My Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Droplets className="text-red-500" size={24} /> Request Blood
        </h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details below to submit a new blood request.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-6">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs font-medium leading-relaxed">
            All blood requests are reviewed by our medical team. Emergency (HIGH priority) requests will be escalated immediately.
            Ensure your hospital and contact information in your profile is up to date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Blood Group Required *</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-white h-11"
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{BLOOD_GROUP_LABELS[bg]}</option>
                ))}
              </select>
            </div>

            {/* Units */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Units Required *</label>
              <input
                type="number"
                name="unitsRequired"
                value={form.unitsRequired}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 2"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 h-11"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Priority Level *</label>
              <select
                name="emergencyLevel"
                value={form.emergencyLevel}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-white h-11"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()} Priority</option>
                ))}
              </select>
            </div>

            {/* Required Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Required Date *</label>
              <input
                type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 h-11"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Additional Notes (Optional)</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Any additional information for the medical team..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{form.remarks.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition shadow-sm hover:shadow-md active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <Droplets size={16} />
            {loading ? "Submitting Request..." : "Submit Blood Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestBlood;
