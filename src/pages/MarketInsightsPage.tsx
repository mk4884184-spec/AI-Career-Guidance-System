import React, { useEffect, useState } from "react";
import { TrendingUp, IndianRupee, Building2, MapPin, Sparkles, Loader2 } from "lucide-react";
import { careerService } from "../services/careerService";
import { MarketChart } from "../components/MarketChart";
import { MarketInsightData } from "../types";

export const MarketInsightsPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("Full Stack Developer");
  const [loading, setLoading] = useState<boolean>(true);
  const [marketData, setMarketData] = useState<MarketInsightData | null>(null);

  const fetchInsights = async (role: string) => {
    setLoading(true);
    try {
      const data = await careerService.getMarketInsights(role);
      setMarketData(data);
    } catch (err) {
      console.error("Market insights error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(selectedRole);
  }, [selectedRole]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 text-xs font-semibold border border-violet-200 dark:border-violet-800 mb-2">
          <TrendingUp className="w-3.5 h-3.5" /> Real-Time Tech Job Market Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Job Market & Salary Insights
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore current salary trends, high-paying industry verticals, top hiring hubs, and most demanded skillsets.
        </p>
      </div>

      {/* Role Selection Dropdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white">Target Career Domain</label>
          <span className="text-xs text-slate-500">Select job title to view live compensation benchmarks</span>
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white font-semibold outline-none"
        >
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="AI / ML Engineer">AI / ML Engineer</option>
          <option value="DevOps & Infrastructure Engineer">DevOps & Infrastructure Engineer</option>
          <option value="Data Scientist">Data Scientist</option>
          <option value="Technical Product Manager">Technical Product Manager</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Fetching market benchmarks via Gemini AI...</p>
        </div>
      ) : marketData ? (
        <div className="space-y-6">
          {/* Key Stat Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block flex items-center gap-1">
                <IndianRupee className="w-4 h-4 text-emerald-500" /> Avg Salary
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {marketData.averageSalary}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Job Demand Growth
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {marketData.jobOpeningsGrowth}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block flex items-center gap-1">
                <Building2 className="w-4 h-4 text-violet-500" /> Hiring Sectors
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white mt-2 block">
                {marketData.topPayingIndustries[0] || "Fintech & AI"}
              </span>
            </div>
          </div>

          {/* Charts */}
          <MarketChart
            salaryData={marketData.yearlySalaryTrend}
            skillData={marketData.topDemandedSkills}
          />

          {/* Strategic Advice */}
          <div className="p-6 rounded-3xl bg-indigo-900 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-sm font-bold">Strategic Hiring Advice for {marketData.role}</h3>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">{marketData.keyAdvice}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};
