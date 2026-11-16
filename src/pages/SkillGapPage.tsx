import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ExternalLink,
  Plus,
  X,
  Loader2,
  Clock,
  History,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { skillGapService } from "../services/skillGapService";
import { SkillGapData } from "../types";

export const SkillGapPage: React.FC = () => {
  const { user } = useAuth();

  const [targetRole, setTargetRole] = useState<string>(user?.targetRole || "Full Stack Developer");
  const [currentSkills, setCurrentSkills] = useState<string[]>(
    user?.skills && user.skills.length > 0
      ? user.skills
      : ["React", "JavaScript", "HTML/CSS", "Git", "Node.js"]
  );
  const [newCurrentSkill, setNewCurrentSkill] = useState<string>("");

  // Preset benchmarks for common roles
  const roleSkillBenchmarks: Record<string, string[]> = {
    "Full Stack Developer": ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Docker", "REST APIs", "Git"],
    "AI / ML Engineer": ["Python", "PyTorch", "TensorFlow", "SQL", "Pandas", "Gemini API", "Vector Databases", "MLOps", "Git"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS / GCP", "CI/CD Pipelines", "Terraform", "Linux", "Bash", "Prometheus"],
    "Data Scientist": ["Python", "SQL", "Pandas", "NumPy", "Data Visualization", "Statistics", "Machine Learning", "Tableau"],
    "Frontend Developer": ["React", "TypeScript", "HTML5", "CSS3/Tailwind", "Next.js", "State Management", "Web Performance", "Git"],
  };

  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    roleSkillBenchmarks[targetRole] || roleSkillBenchmarks["Full Stack Developer"]
  );
  const [newRequiredSkill, setNewRequiredSkill] = useState<string>("");

  const [analysisResult, setAnalysisResult] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<SkillGapData[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await skillGapService.getHistory();
      setHistory(data || []);
      if (data && data.length > 0 && !analysisResult) {
        setAnalysisResult(data[0]);
      }
    } catch (err) {
      console.error("Failed to load skill gap history:", err);
    }
  };

  const handleRoleChange = (role: string) => {
    setTargetRole(role);
    if (roleSkillBenchmarks[role]) {
      setRequiredSkills(roleSkillBenchmarks[role]);
    }
  };

  const handleAddCurrentSkill = () => {
    if (newCurrentSkill.trim() && !currentSkills.includes(newCurrentSkill.trim())) {
      setCurrentSkills([...currentSkills, newCurrentSkill.trim()]);
      setNewCurrentSkill("");
    }
  };

  const handleRemoveCurrentSkill = (skill: string) => {
    setCurrentSkills(currentSkills.filter((s) => s !== skill));
  };

  const handleAddRequiredSkill = () => {
    if (newRequiredSkill.trim() && !requiredSkills.includes(newRequiredSkill.trim())) {
      setRequiredSkills([...requiredSkills, newRequiredSkill.trim()]);
      setNewRequiredSkill("");
    }
  };

  const handleRemoveRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const data = await skillGapService.analyzeGap({
        targetRole,
        currentSkills,
        requiredSkills,
      });
      setAnalysisResult(data);
      await loadHistory();
    } catch (err) {
      console.error("Analysis execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "Medium":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Low":
      default:
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800 mb-2">
            <Target className="w-3.5 h-3.5" /> AI Skill Gap Analysis Module
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Skill Gap Analyzer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare your current skills vs target role required skills. Gemini AI identifies missing competencies, priority levels, estimated learning time, and recommended courses.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <History className="w-4 h-4 text-indigo-500" />
            <span>MongoDB History ({history.length})</span>
          </button>
        )}
      </div>

      {/* History Drawer */}
      {showHistory && history.length > 0 && (
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Saved MongoDB Skill Gap Analyses
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setAnalysisResult(item);
                  setTargetRole(item.targetRole);
                  setCurrentSkills(item.currentSkills);
                  setRequiredSkills(item.requiredSkills);
                  setShowHistory(false);
                }}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 hover:border-indigo-400 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Run #{history.length - index}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                  {item.targetRole}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>Match: <strong className="text-emerald-600 dark:text-emerald-400">{item.overallReadiness}%</strong></span>
                  <span>Missing: {item.missingCount} skills</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Role & Skill Controls Form */}
      <div className="p-6 sm:p-8 premium-card space-y-6">
        {/* Target Role Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-350 mb-2">
            Target Job Role / Career Path
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <select
              value={targetRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="sm:col-span-2 px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Frontend Developer">Frontend Developer</option>
            </select>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Or type custom role..."
              className="px-4 py-2.5 premium-input text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Current Skills vs Required Skills Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Skills */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850/60">
            <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Your Current Verified Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newCurrentSkill}
                onChange={(e) => setNewCurrentSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCurrentSkill();
                  }
                }}
                placeholder="Add current skill..."
                className="flex-1 px-3.5 py-1.5 premium-input text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddCurrentSkill}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-350 text-xs font-semibold border border-emerald-500/20"
                >
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveCurrentSkill(skill)} className="hover:text-rose-400 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Target Required Skills */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-850/60">
            <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" />
              Required Skills Benchmark ({targetRole})
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newRequiredSkill}
                onChange={(e) => setNewRequiredSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRequiredSkill();
                  }
                }}
                placeholder="Add required skill..."
                className="flex-1 px-3.5 py-1.5 premium-input text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddRequiredSkill}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-350 text-xs font-semibold border border-indigo-500/20"
                >
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveRequiredSkill(skill)} className="hover:text-rose-400 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini AI is analyzing skill gaps & courseloads...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Run AI Skill Gap Analysis & Store in MongoDB</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Results View */}
      {analysisResult && (
        <div className="space-y-8 pt-4">
          {/* Top Overview Cards & Progress Bars */}
          <div className="p-6 sm:p-8 premium-card space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">
                  Skill Alignment & Readiness Score
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl font-extrabold text-white">
                    {analysisResult.overallReadiness}%
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Target Role: <strong className="text-slate-200">{analysisResult.targetRole}</strong>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">
                  Matched <strong>{analysisResult.matchedCount}</strong> out of <strong>{analysisResult.totalRequiredCount}</strong> required industry competencies.
                </p>
              </div>

              {/* Progress Circle / Big Bar */}
              <div className="w-full md:w-72 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Overall Coverage</span>
                  <span className="text-indigo-400">{analysisResult.overallReadiness}%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-900 p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-650 to-emerald-500 transition-all duration-700 shadow-sm"
                    style={{ width: `${analysisResult.overallReadiness}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1 font-medium">
                  <span>Current: {analysisResult.matchedCount} skills</span>
                  <span>Missing: {analysisResult.missingCount} skills</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown Progress Bars */}
            {analysisResult.categoryBreakdown && analysisResult.categoryBreakdown.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" /> Category Breakdown Progress
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {analysisResult.categoryBreakdown.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850/60 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span className="truncate">{cat.category}</span>
                        <span className="text-indigo-400">{cat.percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800/40">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between font-semibold">
                        <span>{cat.matchedCount} / {cat.totalCount} acquired</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actionable Summary Rationale */}
            {analysisResult.actionableSummary && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-indigo-200 block">
                    AI Strategic Skill Advice:
                  </span>
                  <p className="leading-relaxed">{analysisResult.actionableSummary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Missing Skills & Recommended Courses List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                Missing Skills & Priority Action Plans ({analysisResult.missingSkillsDetails.length})
              </h2>
            </div>

            {analysisResult.missingSkillsDetails.length === 0 ? (
              <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-sm font-bold text-emerald-350">100% Skill Coverage Achieved!</h3>
                <p className="text-xs text-emerald-300">
                  You possess all standard required competencies for {analysisResult.targetRole}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysisResult.missingSkillsDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 premium-card space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 font-extrabold text-xs text-slate-300 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {item.skillName}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getPriorityBadgeClass(
                            item.priorityLevel
                          )}`}
                        >
                          {item.priorityLevel} Priority
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {item.estimatedLearningTime}
                        </span>
                      </div>
                    </div>

                    {/* Recommended Courses List */}
                    {item.recommendedCourses && item.recommendedCourses.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Recommended Learning Courses
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {item.recommendedCourses.map((course, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex flex-col justify-between space-y-2"
                            >
                              <div>
                                <div className="flex items-center justify-between text-[11px] mb-1.5">
                                  <span className="font-bold text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                                    {course.platform}
                                  </span>
                                  <span className="text-slate-400 font-semibold">
                                    {course.level} • {course.duration}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-200 line-clamp-2">
                                  {course.title}
                                </h4>
                              </div>

                              <a
                                href={course.url || "https://www.coursera.org"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-bold border border-slate-800 hover:text-white transition-all cursor-pointer"
                              >
                                <span>Access Course</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-405" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Matched Competencies */}
          <div className="p-6 sm:p-8 premium-card space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              Verified Matched Competencies ({analysisResult.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-505/10 text-emerald-300 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
