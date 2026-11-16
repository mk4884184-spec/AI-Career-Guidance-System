import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { UserPlus, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [targetRole, setTargetRole] = useState<string>("Full Stack Engineer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        targetRole,
        skills: ["React", "JavaScript", "HTML/CSS"],
        experienceLevel: "Entry Level",
        education: "Bachelor's Degree",
      });
      toast.success("Account created successfully! Welcome aboard.");
      navigate("/");
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to create account. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Create Your Account</h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">Start your AI-powered career counseling journey today.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 text-rose-350 border border-rose-500/20 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-455 shrink-0 animate-bounce" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan Smith"
            className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-355 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jordan@example.com"
            className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
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

        <div>
          <label className="block text-xs font-bold text-slate-350 mb-1">Target Career Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. AI Engineer, Full Stack Developer"
            className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-indigo-655 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-indigo-300" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 font-semibold">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-indigo-405 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

