import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050713] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient radial flares */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />

      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10 px-2 sm:px-4 lg:px-6">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
      
      <footer className="border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-xl py-6 text-xs text-slate-500 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CareerPulse AI</span>
            <span className="text-slate-600">•</span>
            <span>Enterprise Career Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-semibold flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Gemini 2.5 Flash Engine Active</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
