import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { LogIn, Sparkles, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! Login successful.");
      navigate("/");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to log in. Please check your credentials.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("alex@example.com");
    setPassword("password123");
    toast.success("Demo credentials loaded!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Welcome Back</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">Sign in to access your AI career roadmaps and resume audits.</p>
      </div>

      <button
        onClick={fillDemoAccount}
        type="button"
        className="w-full py-2 px-3 rounded-xl bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20 hover:bg-indigo-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Autofill Demo Account (Alex Morgan)</span>
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455 shrink-0 animate-bounce" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-350">Password</label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-indigo-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full premium-input px-4 py-2.5 pr-10 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-205 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Log In to Account</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 font-semibold">
        Don't have an account?{" "}
        <Link to="/register" className="font-bold text-indigo-405 hover:underline">
          Register now
        </Link>
      </p>
    </div>
  );
};

