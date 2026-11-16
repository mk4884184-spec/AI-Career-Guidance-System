import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Compass, Bookmark, User as UserIcon, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCareer } from "../hooks/useCareer";
import { NotificationCenter } from "./NotificationCenter";
import toast from "react-hot-toast";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { bookmarks } = useCareer();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#070a1e]/75 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300 border border-white/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                CareerPulse
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                PRO AI
              </span>
            </div>
            <span className="text-[9px] text-slate-400 block -mt-0.5 font-medium tracking-wider uppercase">
              Autonomous Career Intelligence
            </span>
          </div>
        </Link>

        {/* Right Navigation & CTAs */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            to="/assessment"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 transition-all shadow-sm shadow-indigo-500/10 hover:-translate-y-0.5"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Career Quiz</span>
          </Link>

          <Link
            to="/bookmarks"
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
            title="Saved Career Paths"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#070a1e] shadow-sm">
                {bookmarks.length}
              </span>
            )}
          </Link>

          {/* Notification Bell */}
          <NotificationCenter />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2.5 border-l border-white/[0.08]">
              <Link 
                to="/profile" 
                className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full sm:rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all group"
              >
                <div className="relative">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070a1e]" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-200 leading-tight group-hover:text-indigo-300 transition-colors">
                    {user?.name || "Student Explorer"}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px] font-medium">
                    {user?.targetRole || "Software Engineer"}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl btn-glow-primary text-white"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
