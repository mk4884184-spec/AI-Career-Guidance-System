import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { KeyRound, Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const queryToken = searchParams.get("token");
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error("Reset token is required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(token.trim(), newPassword);
      setIsSuccess(true);
      toast.success(res?.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to reset password. Token may be invalid or expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 premium-card p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Enter your reset token and set a new secure password for your account.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-305">Password Reset Complete!</h3>
            <p className="text-sm text-slate-300 font-medium">
              Your password has been successfully updated. Redirecting you to login...
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10 transition-colors"
              >
                Go to Login Now
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="token" className="block text-xs font-bold text-slate-350 mb-2">
                Reset Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="h-5 w-5" />
                </div>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 premium-input text-white focus:bg-slate-950/80 text-sm font-mono outline-none transition-all"
                  placeholder="Paste your reset token"
                />
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-slate-350 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="new-password"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 premium-input text-white focus:bg-slate-950/80 text-sm outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-205 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-355 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 premium-input text-white focus:bg-slate-950/80 text-sm outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-indigo-600/15 bg-indigo-650 hover:bg-indigo-700 text-sm font-bold text-white transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
