import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "New password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token) {
      toast.error("Invalid reset request: Missing token parameter in URL.");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password, confirmPassword);
      toast.success("Password reset successfully! Please login with your new password.");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Invalid or expired reset token.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 max-w-md w-full mx-auto select-none">
      
      {!token ? (
        <div className="text-center space-y-6">
          <div className="mx-auto w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
            <ShieldAlert size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Missing Token</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              No reset token detected in the URL. Please re-click the reset link sent to your email.
            </p>
          </div>
        </div>
      ) : !success ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              Enter and confirm your new secure password below.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              error={errors.password}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full flex items-center justify-center"
            >
              Reset Password
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="mx-auto w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
            <CheckCircle2 size={28} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Password Reset Complete</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Your password has been successfully updated. You can now log back in.
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-sm transition cursor-pointer shadow-md shadow-red-600/10"
          >
            Go to Login
          </button>
        </div>
      )}

      <div className="mt-8 text-center border-t border-slate-100 pt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 transition"
        >
          <ArrowLeft size={14} />
          Back to Login
        </Link>
      </div>

    </div>
  );
}

export default ResetPassword;
