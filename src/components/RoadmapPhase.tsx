import React from "react";
import { RoadmapPhase as IRoadmapPhase } from "../types";
import { CheckCircle2, Circle, Clock, BookOpen, Award, ExternalLink, Code } from "lucide-react";

interface RoadmapPhaseProps {
  phase: IRoadmapPhase;
  roadmapId?: string;
  onToggleComplete?: (phaseNumber: number) => void;
  isLast?: boolean;
}

export const RoadmapPhase: React.FC<RoadmapPhaseProps> = ({ phase, onToggleComplete, isLast = false }) => {
  return (
    <div className="relative flex gap-4 sm:gap-6 items-start group">
      {/* Timeline Node Column */}
      <div className="flex flex-col items-center self-stretch shrink-0 pt-1">
        {/* Step Marker Badge */}
        <button
          onClick={() => onToggleComplete && onToggleComplete(phase.phaseNumber)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs sm:text-sm transition-all duration-300 z-10 cursor-pointer border ${
            phase.completed
              ? "bg-emerald-500 text-white border-emerald-400/60 shadow-lg shadow-emerald-500/25 hover:scale-105"
              : "bg-[#0f1433] text-indigo-300 border-indigo-500/30 shadow-md hover:bg-indigo-600 hover:text-white hover:border-indigo-400"
          }`}
          title={phase.completed ? "Mark as in-progress" : "Mark step as completed"}
        >
          {phase.completed ? <CheckCircle2 className="w-5 h-5" /> : phase.phaseNumber}
        </button>

        {/* Timeline Connecting Line */}
        {!isLast && (
          <div
            className={`w-0.5 flex-1 my-1.5 transition-all duration-300 ${
              phase.completed 
                ? "bg-gradient-to-b from-emerald-500 to-indigo-500/50" 
                : "bg-white/[0.08]"
            }`}
          />
        )}
      </div>

      {/* Main Phase Card */}
      <div
        className={`flex-1 p-6 rounded-2xl mb-6 transition-all duration-300 border ${
          phase.completed
            ? "border-emerald-500/30 bg-gradient-to-br from-[#0c1a2e]/90 via-[#0a1426]/95 to-[#060816]/95 shadow-xl shadow-emerald-500/5"
            : "border-white/[0.08] bg-gradient-to-br from-[#0c102a]/80 via-[#090d22]/90 to-[#060816]/95 hover:border-indigo-500/30 shadow-xl"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
                Phase {phase.phaseNumber}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> {phase.duration}
              </span>
              {phase.completed && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1 tracking-tight">{phase.title}</h3>
          </div>

          <button
            onClick={() => onToggleComplete && onToggleComplete(phase.phaseNumber)}
            className="p-1.5 rounded-xl hover:bg-white/[0.04] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            title={phase.completed ? "Mark as in-progress" : "Mark phase as completed"}
          >
            {phase.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5 hover:text-indigo-400" />
            )}
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-5 leading-relaxed font-normal">{phase.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Skills to Master */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
            <h4 className="font-extrabold text-white flex items-center gap-1.5 mb-2.5">
              <Code className="w-4 h-4 text-indigo-400" /> Core Skills to Master
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              {phase.skillsToMaster.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Portfolio Projects */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06]">
            <h4 className="font-extrabold text-white flex items-center gap-1.5 mb-2.5">
              <Award className="w-4 h-4 text-violet-400" /> Portfolio Projects
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              {phase.recommendedProjects.map((project, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Free Resources & Links */}
        {phase.freeResources && phase.freeResources.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Verified Learning Curricula:
            </span>
            <div className="flex flex-wrap gap-2">
              {phase.freeResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
                >
                  <span>{res.name}</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
