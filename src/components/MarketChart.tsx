import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface MarketChartProps {
  salaryData: { year: string; salary: number }[];
  skillData: { name: string; demandPercent: number }[];
}

export const MarketChart: React.FC<MarketChartProps> = ({ salaryData, skillData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* Salary Trend Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Yearly Salary Benchmark Growth</h4>
        <p className="text-xs text-slate-500 mb-4">Average annual compensation packages over time (₹ INR)</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salaryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis
                tick={{ fontSize: 11 }}
                stroke="#94a3b8"
                tickFormatter={(val) => `₹${val / 100000}L`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #1e293b", color: "#fff", fontSize: "12px" }}
                formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}/year`, "Avg Salary"]}
              />
              <Area type="monotone" dataKey="salary" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#salaryGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Demanded Skills Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Most Demanded Technical Skills</h4>
        <p className="text-xs text-slate-500 mb-4">Percentage of job postings requiring skill competency</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="#94a3b8" width={110} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "1px solid #1e293b", color: "#fff", fontSize: "12px" }}
                formatter={(val: any) => [`${val}% of Job Postings`, "Demand Score"]}
              />
              <Bar dataKey="demandPercent" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
