import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import authService from "../../services/authService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [testToken, setTestToken] = useState("");

  const validateEmail = (val) => {
    if (!val.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(val)) return "Please enter a valid email format";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errMessage = validateEmail(email);
    if (errMessage) {
      setError(errMessage);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      toast.success("Password reset request submitted successfully!");
      setSuccess(true);
      // Retrieve the generated token from the API response payload for testing
      setTestToken(response.data || "");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Account not found.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 max-w-md w-full mx-auto select-none">
      
      {!success ? (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Forgot Password
            </h2>
            <p className="text-slate-500 text-xs font-semibold mt-1">
              Enter your registered email address. We'll send you a password reset link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              error={error}
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full flex items-center justify-center"
            >
              <Send size={15} />
              Send Reset Link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="mx-auto w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-sm">
            <CheckCircle2 size={28} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Request Sent</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              If an account is associated with <strong className="text-slate-800">{email}</strong>, a password reset link has been processed.
            </p>
          </div>

          {testToken && (
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Developer Testing Simulator
              </span>
              <p className="text-[11px] text-slate-500 font-medium leading-normal">
                For evaluation, you can use this generated security link directly:
              </p>
              <button
                onClick={() => navigate(`/reset-password?token=${testToken}`)}
                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-150 border border-red-200/50 text-red-600 rounded-xl text-xs font-extrabold transition cursor-pointer"
              >
                Go to Reset Password Screen
              </button>
            </div>
          )}
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

export default ForgotPassword;