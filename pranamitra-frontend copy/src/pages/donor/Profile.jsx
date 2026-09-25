import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Lock, Edit3 } from "lucide-react";
import donorPortalService from "../../services/donorPortalService";
import { getUserId } from "../../utils/token";

function Profile() {
  const userId = getUserId();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    collegeName: "",
    department: "",
    studentId: "",
    bloodGroup: "",
    age: "",
    gender: "",
    weight: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Password State
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await donorPortalService.getProfile(userId);
      if (data) {
        // Split name for forms
        let firstName = "";
        let lastName = "";
        const fullName = data.fullName || "";
        const spaceIdx = fullName.indexOf(" ");
        if (spaceIdx !== -1) {
          firstName = fullName.substring(0, spaceIdx);
          lastName = fullName.substring(spaceIdx + 1);
        } else {
          firstName = fullName;
        }

        setProfile({
          firstName,
          lastName,
          email: data.email || "",
          mobileNumber: data.mobileNumber || "",
          collegeName: data.collegeName || "",
          department: data.department || "",
          studentId: data.studentId || "",
          bloodGroup: data.bloodGroup || "",
          age: data.age || "",
          gender: data.gender || "",
          weight: data.weight || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile", error);
      toast.error("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (savingProfile) return;

    const phone = (profile.mobileNumber || "").trim();
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits and start with 6-9.");
      return;
    }

    const pin = (profile.pincode || "").trim();
    if (!/^[0-9]{6}$/.test(pin)) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }

    try {
      setSavingProfile(true);
      await donorPortalService.updateProfile(userId, profile);
      toast.success("Profile details updated successfully.");
      await loadProfile();
    } catch (error) {
      console.error("Failed to update profile", error);
      const errMsg = error.response?.data?.message || "Failed to update profile details.";
      toast.error(errMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (savingSecurity) return;

    if (password.newPassword.length < 6 || password.newPassword.length > 20) {
      toast.error("Password must be between 6 and 20 characters.");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setSavingSecurity(true);
      await donorPortalService.updatePassword(userId, {
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      });
      toast.success("Password changed successfully.");
      setPassword({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Failed to update password", error);
      const errMsg = error.response?.data?.message || "Incorrect current password.";
      toast.error(errMsg);
    } finally {
      setSavingSecurity(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 animate-pulse">
        Loading profile details...
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-gray-500 mt-2">Manage your registration information and account settings.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b pb-4 mb-4">
            <Edit3 className="text-red-500" size={20} />
            <h2 className="text-lg font-bold text-slate-800">Edit Profile Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-slate-50 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={profile.mobileNumber}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">College Name</label>
              <input
                type="text"
                name="collegeName"
                value={profile.collegeName}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={profile.studentId}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-slate-50 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Group</label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800 bg-white"
              >
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleProfileChange}
                required
                min="18"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={profile.weight}
                onChange={handleProfileChange}
                required
                min="45"
                step="0.1"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={profile.state}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={profile.pincode}
                onChange={handleProfileChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm"
          >
            {savingProfile ? "Saving Profile..." : "Update Profile Details"}
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleSavePassword} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between h-[420px]">
          <div>
            <div className="flex items-center gap-2 border-b pb-4 mb-6">
              <Lock className="text-slate-500" size={20} />
              <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={password.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="New password (min 6 chars)"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Re-type new password"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition text-sm text-slate-800"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSecurity}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm mt-6"
          >
            {savingSecurity ? "Saving Password..." : "Change Security Password"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Profile;
