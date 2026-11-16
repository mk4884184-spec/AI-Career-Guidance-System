import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Map,
  FileText,
  Target,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  Briefcase,
  Star,
  Bookmark,
  User,
  ShieldCheck,
  BarChart3,
  Bot,
  GitMerge,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const navGroups = [
    {
      title: "Core AI Suite",
      items: [
        { label: "Dashboard", path: "/", icon: LayoutDashboard },
        { label: "AI Career Quiz", path: "/assessment", icon: Compass },
        { label: "Career Roadmaps", path: "/roadmap", icon: Map },
        { label: "AI Resume Review", path: "/resume", icon: FileText },
        { label: "Skill Gap Analysis", path: "/skill-gap", icon: Target },
        { label: "AI Career Advisor", path: "/chatbot", icon: Bot },
      ],
    },
    {
      title: "Growth & Market",
      items: [
        { label: "Career Comparison", path: "/comparison", icon: GitMerge },
        { label: "Progress Tracker", path: "/progress", icon: CheckSquare },
        { label: "Market Insights", path: "/market", icon: TrendingUp },
        { label: "Mock Interview Prep", path: "/interview", icon: MessageSquare },
      ],
    },
    {
      title: "Discovery & Tools",
      items: [
        { label: "Course Matches", path: "/courses", icon: GraduationCap },
        { label: "Job Opportunities", path: "/jobs", icon: Briefcase },
        { label: "Saved Paths", path: "/bookmarks", icon: Bookmark },
        { label: "Feedback & Reviews", path: "/feedback", icon: Star },
        { label: "Profile Settings", path: "/profile", icon: User },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Administration",
            items: [
              { label: "Reports & Analytics", path: "/analytics", icon: BarChart3 },
              { label: "Admin Panel", path: "/admin", icon: ShieldCheck },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-[#050713]/60 backdrop-blur-xl border-r border-white/[0.06] min-h-[calc(100vh-4rem)] p-3 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/90 to-violet-600/80 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/30"
                        : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110 shrink-0 text-slate-400 group-hover:text-indigo-300" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* AI Assistant Callout */}
      <div className="mt-8 mb-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-950/60 border border-indigo-500/20 text-left relative overflow-hidden group">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-300 flex items-center justify-center mb-2.5 border border-indigo-500/30 shadow-sm shadow-indigo-500/20">
          <Bot className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
          <span>Gemini Intelligence</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </h4>
        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
          Real-time dynamic career auditing & localized Indian compensation data.
        </p>
      </div>
    </aside>
  );
};
