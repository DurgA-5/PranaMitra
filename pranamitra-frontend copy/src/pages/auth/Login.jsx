import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { getUserId } from "../../utils/token";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      // Save credentials to localStorage if rememberMe is selected
      if (rememberMe) {
        localStorage.setItem("remember_email", email);
      } else {
        localStorage.removeItem("remember_email");
      }

      // Safety guard: ensure userId was returned and stored correctly
      const userId = getUserId();
      if (!userId) {
        toast.error("Login failed: user session could not be established. Please try again.");
        return;
      }

      // Call API to check if profile is complete
      const statusRes = await api.get(`/auth/profile-status/${userId}`);
      const { profileExists, role } = statusRes.data?.data ?? statusRes.data;

      toast.success("Successfully logged in.");

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "DONOR") {
        if (profileExists) {
          navigate("/donor");
        } else {
          navigate("/donor/complete-profile");
        }
      } else if (role === "PATIENT") {
        if (profileExists) {
          navigate("/patient");
        } else {
          navigate("/patient/complete-profile");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials.");
      } else {
        setError("Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-lg border border-slate-100 p-8 w-full transition-all duration-200 font-sans">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#212121] tracking-tight">Welcome Back</h2>
        <p className="text-[#6B7280] text-xs font-medium mt-1.5">Sign in to continue to your PranaMitra account.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email Address */}
        <div className="space-y-1.5">
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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Password</label>
          <div className="flex items-center border border-slate-200 rounded-xl px-4 py-3 focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C]/25 transition bg-[#F8F9FA] h-11 relative">
            <Lock size={16} className="text-slate-400 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <label className="flex items-center gap-2 text-[#6B7280] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-[#B71C1C] focus:ring-[#B71C1C]/20 w-4 h-4 cursor-pointer"
            />
            <span>Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-[#B71C1C] hover:text-[#E53935] hover:underline transition-colors">
            Forgot Password
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-[#B71C1C] text-xs font-semibold rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B71C1C] hover:bg-[#E53935] text-white rounded-xl py-3 flex justify-center items-center gap-2 font-bold text-sm tracking-wider uppercase transition shadow-sm hover:shadow-md active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed h-11 mt-6 cursor-pointer"
        >
          <LogIn size={16} />
          {loading ? "Signing In..." : "LOGIN"}
        </button>

        {/* Link to Register */}
        <div className="text-center pt-5 border-t border-slate-100 mt-6 text-xs font-semibold text-[#6B7280]">
          Don't have an account?
          <Link to="/register" className="text-[#B71C1C] hover:text-[#E53935] font-bold ml-1.5 hover:underline">
            Register Now
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

export default Login;