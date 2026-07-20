import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Droplets, CheckCircle, AlertCircle, User, Users } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";

const BLOOD_GROUPS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
const BLOOD_GROUP_LABELS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};
const PRIORITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const REQUEST_FOR_OPTIONS = ["Self", "Family Member", "Friend", "Other"];

function RequestBlood() {
  const userId = getUserId();
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "PATIENT";

  const [requestFor, setRequestFor] = useState("Self");
  const [form, setForm] = useState({
    patientName: "",
    relationship: "",
    age: "",
    gender: "MALE",
    hospitalName: "",
    doctorName: "",
    bloodGroup: "",
    unitsRequired: "1",
    emergencyLevel: "HIGH",
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
    if (requestFor !== "Self") {
      if (!form.patientName.trim()) { toast.error("Please enter patient name."); return false; }
      if (!form.relationship.trim()) { toast.error("Please specify relationship."); return false; }
      if (!form.age || parseInt(form.age, 10) < 1) { toast.error("Please enter a valid age."); return false; }
      if (!form.hospitalName.trim()) { toast.error("Please enter hospital name."); return false; }
      if (!form.doctorName.trim()) { toast.error("Please enter doctor name."); return false; }
    }
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
      const payloadRemarks = requestFor === "Self"
        ? form.remarks
        : `[Request for ${requestFor}: ${form.patientName} (${form.relationship}), Age: ${form.age}, Gender: ${form.gender}, Hosp: ${form.hospitalName}, Dr: ${form.doctorName}]. ${form.remarks}`;

      await patientPortalService.createBloodRequest(userId, {
        patientId: null,
        bloodGroup: form.bloodGroup,
        unitsRequired: parseInt(form.unitsRequired, 10),
        emergencyLevel: form.emergencyLevel,
        requiredDate: form.requiredDate,
        remarks: payloadRemarks || null,
      });

      setSubmitted(true);
      toast.success("Emergency blood request created successfully!");
    } catch (err) {
      console.error("Blood request error:", err?.response?.data);
      const data = err?.response?.data;
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
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Blood Request Broadcasted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Your emergency request has been created and broadcasted to active compatible donors.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
            >
              New Request
            </button>
            <button
              onClick={() => navigate(role === "DONOR" ? "/donor/my-requests" : "/patient/requests")}
              className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition shadow-md shadow-red-600/20"
            >
              View Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
          <Droplets className="text-red-600" size={28} /> Emergency Blood Request
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Raise an emergency blood request for yourself or on behalf of family members and friends.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-red-900 text-xs sm:text-sm font-medium leading-relaxed">
            Emergency requests trigger real-time notifications to matching available donors.
            Double check recipient hospital details to enable smooth bedside delivery.
          </p>
        </div>

        {/* Request For Selector */}
        <div className="mb-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Requesting Blood For
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {REQUEST_FOR_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setRequestFor(opt)}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                  requestFor === opt
                    ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {opt === "Self" ? <User size={14} /> : <Users size={14} />}
                {opt}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conditional Recipient Fields if Not Self */}
          {requestFor !== "Self" && (
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <User size={14} /> Recipient Patient Information ({requestFor})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relationship to You *</label>
                  <input
                    type="text"
                    name="relationship"
                    value={form.relationship}
                    onChange={handleChange}
                    placeholder="e.g. Father, Sister, Colleague"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="e.g. 45"
                    min="1"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-red-500 transition"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={form.hospitalName}
                    onChange={handleChange}
                    placeholder="e.g. Apollo Hospital, Jubilee Hills"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    name="doctorName"
                    value={form.doctorName}
                    onChange={handleChange}
                    placeholder="e.g. Dr. A. K. Rao"
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-red-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Blood & Urgency Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">Required Blood Group *</label>
              <select
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-white h-12 font-bold text-red-600"
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{BLOOD_GROUP_LABELS[bg]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">Units Required *</label>
              <input
                type="number"
                name="unitsRequired"
                value={form.unitsRequired}
                onChange={handleChange}
                min="1"
                placeholder="1"
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 h-12 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">Priority / Urgency Level *</label>
              <select
                name="emergencyLevel"
                value={form.emergencyLevel}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-white h-12 font-bold"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p} Priority</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">Required Date *</label>
              <input
                type="date"
                name="requiredDate"
                value={form.requiredDate}
                onChange={handleChange}
                min={today}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 h-12 font-semibold"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">Additional Emergency Notes</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="e.g. ICU Bed #402, urgent transfusion needed before surgery..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 resize-none bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:bg-slate-300 flex items-center justify-center gap-2 text-sm"
          >
            <Droplets size={18} />
            {loading ? "Broadcasting Emergency Request..." : "Broadcast Emergency Blood Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestBlood;
