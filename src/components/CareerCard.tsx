import React from "react";
import { CareerRecommendation } from "../types";
import { formatMatchScore } from "../utils/formatters";
import { Bookmark, Map, IndianRupee, TrendingUp, CheckCircle2, AlertCircle, Award, Milestone } from "lucide-react";
import { useCareer } from "../hooks/useCareer";

interface CareerCardProps {
  career: CareerRecommendation;
  onGenerateRoadmap: (title: string) => void;
}

export const CareerCard: React.FC<CareerCardProps> = ({ career, onGenerateRoadmap }) => {
  const { addBookmark, removeBookmark, isBookmarked, bookmarks, addRecentlyViewed } = useCareer();
  const matchInfo = formatMatchScore(career.matchScore);
  const bookmarked = isBookmarked(career.title);

  const handleBookmarkToggle = () => {
    if (bookmarked) {
      const found = bookmarks.find((b) => b.title === career.title);
      if (found) removeBookmark(found.id);
    } else {
      addBookmark("career", career.title, career);
    }
  };

  const handleAction = () => {
    addRecentlyViewed(career);
    onGenerateRoadmap(career.title);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] hover:border-indigo-500/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between group relative overflow-hidden">
      {/* Top subtle highlight line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div>
        {/* Header Badges & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${matchInfo.bg} ${matchInfo.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{career.matchScore}% {matchInfo.text}</span>
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08] tracking-wider uppercase">
              High Market Demand
            </span>
          </div>

          <button
            onClick={handleBookmarkToggle}
            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              bookmarked
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-500/20"
                : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/[0.07]"
            }`}
            title={bookmarked ? "Remove Bookmark" : "Save Career Path"}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors tracking-tight">
          {career.title}
        </h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed font-normal">
          {career.description}
        </p>

        {/* Salary & Market Growth */}
        <div className="grid grid-cols-2 gap-3 my-4 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block flex items-center gap-1 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Salary Range
            </span>
            <span className="font-extrabold text-white text-xs sm:text-sm">{career.salaryRange}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Market Outlook
            </span>
            <span className="font-extrabold text-indigo-200 text-xs sm:text-sm truncate block">{career.growthOutlook}</span>
          </div>
        </div>

        {/* Fit Rationale (Reason) */}
        <div className="mb-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1.5">
            AI Profile Match Rationale
          </span>
          <p className="text-xs text-slate-300 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 leading-relaxed font-medium">
            {career.whyGoodFit}
          </p>
        </div>

        {/* Required & Missing Skills */}
        <div className="space-y-3 mb-4">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Core Target Skills:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {career.requiredSkills.map((skill, idx) => (
                <span key={idx} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {career.missingSkills && career.missingSkills.length > 0 && (
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Recommended Skill Gaps:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {career.missingSkills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suitable Certifications */}
        {career.suitableCertifications && career.suitableCertifications.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Award className="w-3.5 h-3.5 text-violet-400" /> Key Certifications:
            </span>
            <ul className="space-y-1.5 pl-0.5">
              {career.suitableCertifications.map((cert, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 font-medium">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Career Roadmap Summary */}
        {career.careerRoadmap && career.careerRoadmap.length > 0 && (
          <div className="mb-5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Milestone className="w-3.5 h-3.5 text-indigo-400" /> Roadmap Timeline Milestone:
            </span>
            <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/[0.06]">
              {career.careerRoadmap.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                  <span className="w-5 h-5 rounded-lg bg-indigo-500/15 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-indigo-500/25">
                    {idx + 1}
                  </span>
                  <span className="leading-snug pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleAction}
        className="w-full py-3 px-4 rounded-xl btn-glow-primary text-white text-xs font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer"
      >
        <Map className="w-4 h-4" />
        <span>Generate Interactive Roadmap</span>
      </button>
    </div>
  );
};
