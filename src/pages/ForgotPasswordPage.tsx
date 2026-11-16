import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, KeyRound, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email);
      setIsSent(true);
      if (res?.data?.resetToken) {
        setResetToken(res.data.resetToken);
        toast.success("Password reset token generated!");
      } else {
        toast.success(res?.message || "Reset instructions sent to your email.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to process request");
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password?</h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            No worries! Enter your registered email address and we'll send you password reset instructions.
          </p>
        </div>

        {isSent ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-405 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-bold text-emerald-300">Reset instructions created!</p>
                <p className="mt-1 text-slate-300 font-medium">
                  If an account exists for <span className="font-semibold text-white">{email}</span>, you can now reset your password.
                </p>
              </div>
            </div>

            {resetToken && (
              <div className="p-4 bg-indigo-950/40 border border-indigo-800/40 rounded-xl space-y-3">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Demo / Dev Security Token</p>
                <div className="p-2.5 bg-slate-955 rounded-lg font-mono text-xs text-indigo-200 break-all select-all border border-slate-800">
                  {resetToken}
                </div>
                <button
                  onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
                >
                  Proceed to Reset Form
                  <ArrowRight className="w-4 h-4 text-indigo-300" />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  setIsSent(false);
                  setResetToken(null);
                }}
                className="w-full py-2.5 px-4 border border-slate-800 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-850 hover:text-white transition-colors cursor-pointer"
              >
                Send to another email
              </button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors animate-pulse"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-slate-350 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 premium-input text-white focus:bg-slate-950/80 text-sm outline-none transition-all"
                  placeholder="name@example.com"
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
                  Generating Token...
                </>
              ) : (
                "Send Reset Instructions"
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
