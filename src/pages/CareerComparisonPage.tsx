import React, { useState } from "react";
import { GitMerge, IndianRupee, TrendingUp, Award, Bookmark, ArrowRight, Sparkles, Loader2, BookOpen } from "lucide-react";
import { careerService } from "../services/careerService";
import { toast } from "react-hot-toast";

interface ComparisonResult {
  careerA: string;
  careerB: string;
  salaryComparison: string;
  growthComparison: string;
  skillsComparison: string;
  certificationsComparison: string;
  difficultyComparison: string;
  verdict: string;
}

export const CareerComparisonPage: React.FC = () => {
  const [careerA, setCareerA] = useState("");
  const [careerB, setCareerB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerA.trim() || !careerB.trim()) {
      toast.error("Please fill in both career fields to compare");
      return;
    }

    setLoading(true);
    try {
      const data = await careerService.compareCareers(careerA, careerB);
      setResult(data);
      toast.success("AI comparison generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate AI comparison");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Career Comparison</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analyze two career options side-by-side. Compare salary expectations, skills overlap, market demand, and difficulty.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-6 premium-card">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI Side-by-Side Comparator</h2>
            <p className="text-[10px] text-slate-400 font-medium">Enter two career paths to check market demand, learning difficulty, and placement rates.</p>
          </div>
        </div>

        <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career Path A</label>
            <input
              type="text"
              required
              value={careerA}
              onChange={(e) => setCareerA(e.target.value)}
              placeholder="e.g. Frontend React Developer"
              className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career Path B</label>
            <input
              type="text"
              required
              value={careerB}
              onChange={(e) => setCareerB(e.target.value)}
              placeholder="e.g. DevOps / Platform Engineer"
              className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Market Models...
                </>
              ) : (
                <>
                  Compare Careers
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comparison results */}
      {result && (
        <div className="premium-card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-center gap-2.5 py-2 border-b border-slate-800/60">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {result.careerA}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest lowercase">vs</span>
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              {result.careerB}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              {/* Salary */}
              <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  Salary Benchmarks
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.salaryComparison}
                </p>
              </div>

              {/* Growth */}
              <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  Growth & Demand Outlook
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.growthComparison}
                </p>
              </div>

              {/* Difficulty */}
              <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Difficulty & Skill Curve
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.difficultyComparison}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Skills */}
              <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                  Required Core Overlap
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.skillsComparison}
                </p>
              </div>

              {/* Certs */}
              <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  Market Key Hirers & Certs
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {result.certificationsComparison}
                </p>
              </div>

              {/* AI Verdict */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950/30 rounded-xl space-y-1.5 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  AI Placement Verdict
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                  {result.verdict}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
