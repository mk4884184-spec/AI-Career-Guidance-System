import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
          CareerPulse <span className="text-indigo-600 dark:text-indigo-400">AI</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
        <Outlet />
      </div>
    </div>
  );
};
