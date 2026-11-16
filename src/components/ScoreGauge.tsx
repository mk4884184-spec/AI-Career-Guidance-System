import React from "react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  subtitle?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 140, subtitle }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 80) return { stroke: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" };
    if (val >= 65) return { stroke: "#6366f1", bg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" };
    if (val >= 50) return { stroke: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" };
    return { stroke: "#ef4444", bg: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800" };
  };

  const status = getColor(score);

  const getStatusText = (val: number) => {
    if (val >= 80) return "Strong ATS Match";
    if (val >= 65) return "Good ATS Match";
    if (val >= 50) return "Moderate Optimization Needed";
    return "High Priority Rewrites Needed";
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Gauge Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={status.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {score}<span className="text-sm font-semibold text-slate-400">%</span>
          </span>
          {subtitle && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{subtitle}</span>}
        </div>
      </div>
      <div className="mt-3 text-center space-y-1">
        <div className="text-xs font-bold text-slate-900 dark:text-white">{label}</div>
        <div className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.bg}`}>
          {getStatusText(score)}
        </div>
      </div>
    </div>
  );
};
