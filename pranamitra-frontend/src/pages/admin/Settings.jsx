import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import settingsService from "../../services/settingsService";
import { getUserId } from "../../utils/token";

function Settings() {
  const userId = getUserId();

  // Profile State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    roleName: "ADMIN",
  });

  // Security State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // App Settings State
  const [appLanguage, setAppLanguage] = useState(localStorage.getItem("appLanguage") || "English");
  const [defaultCity, setDefaultCity] = useState(localStorage.getItem("defaultCity") || "Hyderabad");
  const [notifPreference, setNotifPreference] = useState(localStorage.getItem("notifPreference") || "Email & SMS");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [savingApp, setSavingApp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User session not found.");
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await settingsService.getUserProfile(userId);
        const userData = res?.data ?? res;
        if (userData) {
          setProfile({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            mobileNumber: userData.mobileNumber || "",
            roleName: userData.roleName || "ADMIN",
          });
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
        setError("Unable to load user profile details.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const mobile = (profile.mobileNumber || "").trim();
    if (!mobile || !/^[6-9][0-9]{9}$/.test(mobile)) {
      setError("Phone Number must be exactly 10 digits and start with a digit between 6 and 9.");
      toast.error("Invalid phone number format.");
      return;
    }

    try {
      setSavingProfile(true);
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        roleName: profile.roleName,
      };

      const res = await settingsService.updateUserProfile(userId, payload);
      const updated = res?.data ?? res;

      if (updated) {
        const full = `${updated.firstName} ${updated.lastName}`.trim();
        localStorage.setItem("fullName", full);
        localStorage.setItem("email", updated.email);
        toast.success("Profile details updated successfully.");
        setSuccess("Profile details updated successfully.");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      const errorMsg = err.response?.data?.message || "Failed to update profile details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password) {
      setError("Please specify a new password.");
      toast.error("Please specify a new password.");
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setError("Password must be between 6 and 20 characters.");
      toast.error("Password length must be 6-20 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSavingSecurity(true);
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        roleName: profile.roleName,
        password: password,
      };

      await settingsService.updateUserProfile(userId, payload);
      setPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully.");
      setSuccess("Password changed successfully.");
    } catch (err) {
      console.error("Failed to change password", err);
      const errorMsg = err.response?.data?.message || "Failed to change password.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingSecurity(false);
    }
  };

  const handleSaveApp = (e) => {
    e.preventDefault();
    setSavingApp(true);
    localStorage.setItem("appLanguage", appLanguage);
    localStorage.setItem("defaultCity", defaultCity);
    localStorage.setItem("notifPreference", notifPreference);
    setTimeout(() => {
      setSavingApp(false);
      toast.success("Application settings saved successfully.");
      setSuccess("Application settings saved successfully.");
    }, 500);
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500 animate-pulse">
        Loading settings...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
      <p className="text-gray-500 mt-2 mb-8">
        Manage your PranaMitra application settings and profile.
      </p>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Administrator Profile */}
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 text-slate-800">
              Administrator Profile
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    required
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profile.mobileNumber}
                  onChange={handleProfileChange}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
          >
            {savingProfile ? "Saving Profile..." : "Update Profile Details"}
          </button>
        </form>

        {/* Application Settings */}
        <form onSubmit={handleSaveApp} className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-6 text-slate-800">
              Application Settings
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Language Preference
                </label>
                <select
                  value={appLanguage}
                  onChange={(e) => setAppLanguage(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                >
                  <option value="English">English</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Default Operational City
                </label>
                <input
                  type="text"
                  value={defaultCity}
                  onChange={(e) => setDefaultCity(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Notification Alerts
                </label>
                <select
                  value={notifPreference}
                  onChange={(e) => setNotifPreference(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
                >
                  <option value="Email & SMS">Email & SMS Alerts</option>
                  <option value="Email Only">Email Alerts Only</option>
                  <option value="SMS Only">SMS Alerts Only</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingApp}
            className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
          >
            {savingApp ? "Saving Preferences..." : "Save Preferences"}
          </button>
        </form>
      </div>

      {/* Security */}
      <form onSubmit={handleSaveSecurity} className="bg-white rounded-2xl shadow-md p-6 mt-8 border border-slate-100">
        <h2 className="text-xl font-bold mb-6 text-slate-800">
          Change Password
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingSecurity}
          className="mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition shadow-sm"
        >
          {savingSecurity ? "Saving Password..." : "Change Security Password"}
        </button>
      </form>
    </>
  );
}

export default Settings;