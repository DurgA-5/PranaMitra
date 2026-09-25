import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User2, Edit2, X, CheckCircle, Lock, Eye, EyeOff, Building2, AlertCircle } from "lucide-react";
import patientPortalService from "../../services/patientPortalService";
import { getUserId } from "../../utils/token";

const BLOOD_GROUPS = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-", B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-", O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

function Profile() {
  const userId = getUserId();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Profile state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Change Password state
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ old: false, new: false, confirm: false });
  const [savingPwd, setSavingPwd] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await patientPortalService.getProfile(userId);
      setProfile(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const openEdit = () => {
    setEditForm({
      hospitalName: profile?.hospitalName ?? "",
      doctorName: profile?.doctorName ?? "",
      address: profile?.address ?? "",
      city: profile?.city ?? "",
      state: profile?.state ?? "",
      pincode: profile?.pincode ?? "",
      attenderName: profile?.attenderName ?? "",
      attenderMobile: profile?.attenderMobile ?? "",
    });
    setEditOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{6}$/.test(editForm.pincode)) { toast.error("Pincode must be 6 digits."); return; }
    if (!/^[6-9][0-9]{9}$/.test(editForm.attenderMobile)) { toast.error("Emergency contact must be a valid 10-digit number."); return; }
    try {
      setSaving(true);
      const updated = await patientPortalService.updateProfile(userId, editForm);
      setProfile(updated);
      setEditOpen(false);
      toast.success("Hospital & emergency profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) { toast.error("New passwords do not match."); return; }
    if (pwdForm.newPassword.length < 6) { toast.error("New password must be at least 6 characters."); return; }
    try {
      setSavingPwd(true);
      await patientPortalService.updatePassword(userId, {
        oldPassword: pwdForm.oldPassword,
        newPassword: pwdForm.newPassword,
      });
      setPwdOpen(false);
      setPwdForm({ oldPassword: "", newPassword: "", confirm: "" });
      toast.success("Password changed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setSavingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse max-w-3xl mx-auto">
        <div className="h-40 bg-white rounded-2xl" />
        <div className="h-64 bg-white rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <User2 className="text-red-500" size={26} /> Patient Profile & Hospital Details
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Update your current hospital location and emergency contact details anytime.
          </p>
        </div>
        <button
          onClick={openEdit}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition shadow-md shadow-red-600/20 shrink-0"
        >
          <Edit2 size={16} /> Edit Hospital & Contact
        </button>
      </div>

      {/* Hospital Change Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800 text-xs sm:text-sm">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Hospital Transfer / Relocation Alert</span>
          Patients frequently change hospital rooms or medical facilities. Keeping your hospital name, doctor name, and room address updated ensures assigned donors reach your bedside directly without delays.
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-red-600/10">
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shrink-0">
            {profile?.patientName?.[0] ?? "P"}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{profile?.patientName}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-red-100 text-xs font-semibold">
              <span className="bg-white/10 px-3 py-1 rounded-lg">🩸 Blood Group: {BLOOD_GROUPS[profile?.bloodGroup] ?? profile?.bloodGroup}</span>
              <span>•</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Gender: {profile?.gender?.charAt(0) + profile?.gender?.slice(1).toLowerCase()}</span>
              <span>•</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg">Age: {profile?.age}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Fields Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-red-500" /> Current Medical Facility Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["Hospital Name", profile?.hospitalName],
            ["Doctor Name", profile?.doctorName],
            ["Hospital Address", profile?.address],
            ["City", profile?.city],
            ["State", profile?.state],
            ["Pincode", profile?.pincode],
            ["Emergency Attender Name", profile?.attenderName],
            ["Emergency Contact Mobile", profile?.attenderMobile],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-bold text-slate-800">{value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={openEdit}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition shadow-md shadow-red-600/20"
        >
          <Edit2 size={16} /> Edit Profile Anytime
        </button>
        <button
          onClick={() => setPwdOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition shadow-sm"
        >
          <Lock size={16} /> Security & Password
        </button>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-800 text-lg">Edit Hospital & Emergency Profile</h3>
              <button onClick={() => setEditOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleEditSave} className="overflow-y-auto flex-1 p-6 space-y-4">
              {[
                { label: "Hospital Name", name: "hospitalName" },
                { label: "Doctor Name", name: "doctorName" },
                { label: "Hospital Address", name: "address" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Pincode", name: "pincode" },
                { label: "Emergency Attender Name", name: "attenderName" },
                { label: "Emergency Contact Mobile Number", name: "attenderMobile" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</label>
                  <input
                    type="text"
                    required
                    value={editForm[name] ?? ""}
                    onChange={(e) => setEditForm((p) => ({ ...p, [name]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 h-11 bg-slate-50"
                  />
                </div>
              ))}
              <button type="submit" disabled={saving} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition disabled:bg-slate-300 flex items-center justify-center gap-2 text-sm shadow-md shadow-red-600/20">
                <CheckCircle size={16} /> {saving ? "Updating..." : "Save Hospital Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {pwdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">Change Password</h3>
              <button onClick={() => setPwdOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
              {[
                { label: "Current Password", field: "oldPassword", show: showPwd.old, toggle: () => setShowPwd((p) => ({ ...p, old: !p.old })) },
                { label: "New Password", field: "newPassword", show: showPwd.new, toggle: () => setShowPwd((p) => ({ ...p, new: !p.new })) },
                { label: "Confirm New Password", field: "confirm", show: showPwd.confirm, toggle: () => setShowPwd((p) => ({ ...p, confirm: !p.confirm })) },
              ].map(({ label, field, show, toggle }) => (
                <div key={field}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</label>
                  <div className="flex items-center border border-slate-200 rounded-xl px-4 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition bg-slate-50 h-11">
                    <input
                      type={show ? "text" : "password"}
                      required
                      value={pwdForm[field]}
                      onChange={(e) => setPwdForm((p) => ({ ...p, [field]: e.target.value }))}
                      className="flex-1 outline-none text-sm text-slate-800 bg-transparent"
                    />
                    <button type="button" onClick={toggle} className="text-slate-400 hover:text-slate-600 ml-2">
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" disabled={savingPwd} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition disabled:bg-slate-300 text-sm">
                {savingPwd ? "Updating..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
