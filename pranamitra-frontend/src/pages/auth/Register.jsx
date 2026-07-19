import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Mail, Phone, Lock, UserPlus, Heart, Users, Eye, EyeOff } from "lucide-react";
import authService from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("DONOR"); // DONOR or PATIENT
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Field Validations
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobileNumber.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
      toast.error("Mobile number must be exactly 10 digits and start with 6-9.");
      return;
    }

    if (password.length < 6 || password.length > 20) {
      toast.error("Password must be between 6 and 20 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        roleName: role,
      });

      toast.success("Account registered successfully! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration failed", error);
      const errorData = error.response?.data;
      const errMsg =
        errorData?.message ||
        (errorData && typeof errorData === "object"
          ? Object.values(errorData)[0]
          : null) ||
        "Registration failed. Please check for duplicate email or mobile number.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-lg border border-slate-100 p-8 w-full transition-all duration-200 font-sans">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#212121] tracking-tight">Create Your Account</h2>
        <p className="text-[#6B7280] text-xs font-medium mt-1.5">Join the PranaMitra community today.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Role Selection Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setRole("DONOR")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition text-xs font-bold cursor-pointer ${
              role === "DONOR"
                ? "border-[#B71C1C] bg-[#B71C1C]/5 text-[#B71C1C] shadow-sm"
                : "border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-500"
            }`}
          >
            <Users size={16} />
            <span>Student Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("PATIENT")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition text-xs font-bold cursor-pointer ${
              role === "PATIENT"
                ? "border-[#B71C1C] bg-[#B71C1C]/5 text-[#B71C1C] shadow-sm"
                : "border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-500"
            }`}
          >
            <Heart size={16} />
            <span>Patient</span>
          </button>
        </div>

        {/* First & Last Name Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">First Name</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11">
              <User size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="John"
                required
                className="ml-3 w-full outline-none text-sm font-medium text-[#212121] bg-transparent placeholder-slate-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Last Name</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11">
              <User size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Doe"
                required
                className="ml-3 w-full outline-none text-sm font-medium text-[#212121] bg-transparent placeholder-slate-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Email Address</label>
          <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11">
            <Mail size={16} className="text-slate-400 shrink-0" />
            <input
              type="email"
              placeholder="name@example.com"
              required
              className="ml-3 w-full outline-none text-sm font-medium text-[#212121] bg-transparent placeholder-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Phone Number</label>
          <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11">
            <Phone size={16} className="text-slate-400 shrink-0" />
            <input
              type="tel"
              placeholder="9876543210"
              required
              className="ml-3 w-full outline-none text-sm font-medium text-[#212121] bg-transparent placeholder-slate-400"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Password</label>
          <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11 relative">
            <Lock size={16} className="text-slate-400 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              required
              className="ml-3 w-full pr-10 outline-none text-sm font-medium text-[#212121] bg-transparent placeholder-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Confirm Password</label>
          <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11 relative">
            <Lock size={16} className="text-slate-400 shrink-0" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              required
              className="ml-3 w-full pr-10 outline-none text-sm font-medium text-[#212121] bg-transparent placeholder-slate-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B71C1C] hover:bg-[#E53935] text-white rounded-xl py-3 flex justify-center items-center gap-2 font-bold text-sm tracking-wider uppercase transition shadow-sm hover:shadow-md active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed h-11 mt-6 cursor-pointer"
        >
          <UserPlus size={16} />
          {loading ? "Registering..." : "CREATE ACCOUNT"}
        </button>

        {/* Link to Login */}
        <div className="text-center pt-5 border-t border-slate-100 mt-5 text-xs font-semibold text-[#6B7280]">
          Already have an account?
          <Link to="/login" className="text-[#B71C1C] hover:text-[#E53935] font-bold ml-1.5 hover:underline">
            Login Now
          </Link>
        </div>

        {/* Back to Home Link */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#B71C1C] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
