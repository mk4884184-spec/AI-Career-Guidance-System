import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  color?: "indigo" | "emerald" | "violet" | "amber";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = "indigo",
}) => {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25 shadow-indigo-500/10",
      topHighlight: "from-indigo-500/40 via-indigo-500/10 to-transparent",
    },
    emerald: {
      bg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25 shadow-emerald-500/10",
      topHighlight: "from-emerald-500/40 via-emerald-500/10 to-transparent",
    },
    violet: {
      bg: "bg-violet-500/10 text-violet-300 border-violet-500/25 shadow-violet-500/10",
      topHighlight: "from-violet-500/40 via-violet-500/10 to-transparent",
    },
    amber: {
      bg: "bg-amber-500/10 text-amber-300 border-amber-500/25 shadow-amber-500/10",
      topHighlight: "from-amber-500/40 via-amber-500/10 to-transparent",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c102a]/80 via-[#090d22]/90 to-[#060816]/95 border border-white/[0.07] hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group relative overflow-hidden">
      {/* Top ambient color streak */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${scheme.topHighlight}`} />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border shadow-sm transition-transform duration-200 group-hover:scale-110 ${scheme.bg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <span className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
            {badge}
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
