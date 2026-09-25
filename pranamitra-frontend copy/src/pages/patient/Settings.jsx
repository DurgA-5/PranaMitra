import { useState } from "react";
import { toast } from "react-toastify";
import { Settings as SettingsIcon, Lock, Eye, EyeOff, Bell, CheckCircle } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";

function Settings() {
  const userId = getUserId();

  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ old: false, new: false, confirm: false });
  const [savingPwd, setSavingPwd] = useState(false);

  // Notification preferences (local state only — no backend endpoint needed yet)
  const [prefs, setPrefs] = useState({
    requestUpdates: true,
    donorAccepted: true,
    requestCompleted: true,
    systemAlerts: true,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) { toast.error("New passwords do not match."); return; }
    if (pwdForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    try {
      setSavingPwd(true);
      await patientPortalService.updatePassword(userId, {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdForm({ oldPassword: "", newPassword: "", confirm: "" });
      toast.success("Password changed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPwd(false);
    }
  };

  const togglePref = (key) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success("Notification preference updated.");
      return updated;
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <SettingsIcon className="text-red-500" size={24} /> Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account security and notification preferences.</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
          <Lock size={17} className="text-red-500" /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { label: "Current Password", field: "oldPassword", show: showPwd.old, toggle: () => setShowPwd((p) => ({ ...p, old: !p.old })) },
            { label: "New Password", field: "newPassword", show: showPwd.new, toggle: () => setShowPwd((p) => ({ ...p, new: !p.new })) },
            { label: "Confirm New Password", field: "confirm", show: showPwd.confirm, toggle: () => setShowPwd((p) => ({ ...p, confirm: !p.confirm })) },
          ].map(({ label, field, show, toggle }) => (
            <div key={field}>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</label>
              <div className="flex items-center border border-slate-300 rounded-xl px-4 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition bg-white h-11">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={pwdForm[field]}
                  onChange={(e) => setPwdForm((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder="••••••••"
                  className="flex-1 outline-none text-sm text-slate-800 bg-transparent"
                />
                <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600 ml-2">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={savingPwd}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:bg-slate-300"
          >
            <CheckCircle size={15} />
            {savingPwd ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
          <Bell size={17} className="text-red-500" /> Notification Preferences
        </h2>
        <div className="space-y-4">
          {[
            { key: "requestUpdates", label: "Request Status Updates", desc: "Get notified when your request status changes." },
            { key: "donorAccepted", label: "Donor Accepted", desc: "Get notified when a donor accepts your request." },
            { key: "requestCompleted", label: "Request Completed", desc: "Get notified when a blood donation is completed." },
            { key: "systemAlerts", label: "System Alerts", desc: "Important system and account notifications." },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePref(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs[key] ? "bg-red-500" : "bg-slate-200"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
