import React, { useState } from "react";
import { useCareer } from "../hooks/useCareer";
import { careerService } from "../services/careerService";
import { RoadmapPhase } from "../components/RoadmapPhase";
import { Map, Sparkles, Loader2, CheckCircle2, Bookmark, Download, BookOpen } from "lucide-react";
import { exportRoadmapToPDF } from "../utils/pdfExport";
import toast from "react-hot-toast";

export const RoadmapPage: React.FC = () => {
  const { activeRoadmap, setActiveRoadmap, addBookmark, isBookmarked } = useCareer();
  const [careerTitleInput, setCareerTitleInput] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("Beginner");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerTitleInput.trim()) return;
    setLoading(true);
    try {
      const roadmap = await careerService.generateRoadmap(careerTitleInput.trim(), experienceLevel);
      setActiveRoadmap(roadmap);
    } catch (err) {
      console.error("Roadmap generation error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePhase = async (phaseNumber: number) => {
    if (!activeRoadmap) return;
    try {
      const updated = await careerService.toggleRoadmapPhase(activeRoadmap.id, phaseNumber);
      setActiveRoadmap(updated);
    } catch {
      // Local fallback toggle
      const updatedPhases = activeRoadmap.phases.map((p) =>
        p.phaseNumber === phaseNumber ? { ...p, completed: !p.completed } : p
      );
      setActiveRoadmap({ ...activeRoadmap, phases: updatedPhases });
    }
  };

  const completedPhasesCount = activeRoadmap?.phases.filter((p) => p.completed).length || 0;
  const totalPhasesCount = activeRoadmap?.phases.length || 1;
  const progressPercent = Math.round((completedPhasesCount / totalPhasesCount) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-semibold border border-violet-500/25 mb-2">
          <Map className="w-3.5 h-3.5 text-violet-400" /> Interactive AI Career Roadmap Builder
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Step-by-Step Career Roadmaps
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Structured chronological milestones, skills, recommended projects, and free learning resources for any role.
        </p>
      </div>

      {/* Generator Control Bar */}
      <form onSubmit={handleGenerate} className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={careerTitleInput}
          onChange={(e) => setCareerTitleInput(e.target.value)}
          placeholder="e.g. AI Full-Stack Developer, DevOps Engineer, Data Scientist..."
          className="flex-1 premium-input px-4 py-3 text-xs outline-none transition-all text-white placeholder:text-slate-500"
        />
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="px-4 py-3 rounded-xl border border-white/[0.1] bg-black/40 text-xs font-semibold text-white outline-none cursor-pointer hover:bg-black/60 transition-colors"
        >
          <option value="Beginner">Beginner Level</option>
          <option value="Intermediate">Intermediate Level</option>
          <option value="Advanced">Advanced Senior Level</option>
        </select>
        <button
          type="submit"
          disabled={loading || !careerTitleInput.trim()}
          className="px-6 py-3 rounded-xl btn-glow-primary text-white font-bold text-xs flex items-center justify-center gap-2 shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Building Roadmap...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Build Roadmap</span>
            </>
          )}
        </button>
      </form>

      {/* Active Roadmap Display */}
      {activeRoadmap ? (
        <div className="space-y-6">
          {/* Roadmap Header & Progress Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block mb-1">
                Target Career Pathway
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {activeRoadmap.careerTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">Estimated Timeline: <span className="text-slate-200 font-bold">{activeRoadmap.overallTimeline}</span></p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-right mr-3">
                <span className="text-xs font-bold text-slate-200">{progressPercent}% Completed</span>
                <div className="w-36 h-2 rounded-full bg-black/50 overflow-hidden mt-1.5 border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={() => {
                  try {
                    exportRoadmapToPDF(activeRoadmap);
                    toast.success("Downloading Career Roadmap PDF...");
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to generate PDF download.");
                  }
                }}
                className="px-4 py-2.5 rounded-xl btn-glow-primary text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                title="Download Roadmap as PDF document"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => addBookmark("roadmap", activeRoadmap.careerTitle, activeRoadmap)}
                className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                title="Save Roadmap to Bookmarks"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked(activeRoadmap.careerTitle) ? "fill-current text-indigo-400" : ""}`} />
              </button>
            </div>
          </div>

          {/* Timeline Phases Container */}
          <div className="pt-2">
            {activeRoadmap.phases.map((phase, index) => (
              <RoadmapPhase
                key={phase.phaseNumber}
                phase={phase}
                roadmapId={activeRoadmap.id}
                onToggleComplete={handleTogglePhase}
                isLast={index === activeRoadmap.phases.length - 1}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-white">No Active Career Roadmap</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5 mb-6 font-normal leading-relaxed">
            Enter a career role above or take the AI Career Quiz to automatically generate your tailored step-by-step milestone path.
          </p>
          <button
            onClick={() => {
              setCareerTitleInput("AI Full-Stack Developer");
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/25 transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Try sample: "AI Full-Stack Developer"</span>
          </button>
        </div>
      )}
    </div>
  );
};
