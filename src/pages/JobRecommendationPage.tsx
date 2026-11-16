import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Sparkles,
  Loader2,
  MapPin,
  DollarSign,
  GraduationCap,
  Clock,
  ExternalLink,
  Search,
  Bookmark,
  Plus,
  X,
  Building2,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { jobService } from "../services/jobService";
import { JobRecommendation, JobRecommendationResponse } from "../types";
import toast from "react-hot-toast";

export const JobRecommendationPage: React.FC = () => {
  // Input Criteria State
  const [skills, setSkills] = useState<string[]>([
    "React",
    "TypeScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "REST APIs"
  ]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [education, setEducation] = useState<string>("Bachelor's Degree in Computer Science");
  const [experience, setExperience] = useState<string>("2-4 years");
  const [location, setLocation] = useState<string>("San Francisco, CA or Remote");

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<JobRecommendationResponse | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("all");
  const [selectedExpFilter, setSelectedExpFilter] = useState<string>("all");
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match" | "posted">("match");

  // Bookmarking / Saved Jobs
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saved_job_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch initial recommendations on load
  useEffect(() => {
    handleFetchRecommendations();
  }, []);

  const handleFetchRecommendations = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await jobService.getRecommendations(skills, education, experience, location);
      setData(res);
      toast.success("AI found matching job openings!");
    } catch (err) {
      console.error("Job recommendation error:", err);
      toast.error("Failed to fetch job recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const toggleSaveJob = (jobId: string, jobTitle: string) => {
    let updated: string[];
    if (savedJobIds.includes(jobId)) {
      updated = savedJobIds.filter((id) => id !== jobId);
      toast.success(`Removed "${jobTitle}" from saved jobs.`);
    } else {
      updated = [...savedJobIds, jobId];
      toast.success(`Saved "${jobTitle}" to your job board!`);
    }
    setSavedJobIds(updated);
    localStorage.setItem("saved_job_ids", JSON.stringify(updated));
  };

  // Filter & Sort jobs
  const jobs = data?.jobs || [];
  const filteredJobs = jobs
    .filter((job) => {
      // Job Type Filter
      if (selectedJobType !== "all" && job.jobType.toLowerCase() !== selectedJobType.toLowerCase()) {
        return false;
      }

      // Min match score filter
      if (job.matchPercentage < minMatchFilter) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.jobTitle.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchLocation = job.location.toLowerCase().includes(q);
        const matchSkills = job.skillsRequired.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchLocation && !matchSkills) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "match") {
        return b.matchPercentage - a.matchPercentage;
      }
      return 0;
    });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
          <Briefcase className="w-3.5 h-3.5" /> AI Job Recommendation Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Career & Job Matching
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Discover high-match job opportunities aligned with your technical skills, experience level, education background, and location preferences.
        </p>
      </div>

      {/* User Search & Criteria Setup Card */}
      <form
        onSubmit={handleFetchRecommendations}
        className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Education Level */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> Education Level
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Bachelor's Degree in Computer Science">Bachelor's Degree (BS / CS)</option>
              <option value="Master's Degree in Software Engineering">Master's Degree (MS / SE)</option>
              <option value="Associate Degree / Bootcamp Graduate">Associate Degree / Bootcamp Graduate</option>
              <option value="Self-Taught / Equivalent Experience">Self-Taught / Practical Experience</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" /> Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="0-1 years (Entry / Junior)">0-1 years (Entry Level / Junior)</option>
              <option value="2-4 years (Mid Level)">2-4 years (Mid-Level Developer)</option>
              <option value="5-8 years (Senior / Specialist)">5-8 years (Senior Engineer)</option>
              <option value="8+ years (Lead / Tech Director)">8+ years (Staff / Lead Architect)</option>
            </select>
          </div>

          {/* Preferred Location */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location Preference
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, NY, London or Remote..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Skills Tag Management */}
        <div>
          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1.5">
            Key Technical Skills & Stack ({skills.length}):
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-500 p-0.5 transition-colors cursor-pointer"
                  title="Remove skill tag"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add skill tag (e.g. Docker, GraphQL)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Find Matching Jobs</span>
          </button>
        </div>
      </form>

      {/* Main Results Container */}
      {data && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, or skill..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Pills / Options */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Job Type Filter */}
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="remote">Remote Only</option>
                <option value="contract">Contract</option>
                <option value="part-time">Part-time</option>
              </select>

              {/* Min Match Filter */}
              <select
                value={minMatchFilter}
                onChange={(e) => setMinMatchFilter(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value={0}>All Match Scores</option>
                <option value={85}>85%+ Match Only</option>
                <option value={90}>90%+ High Match</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "match" | "posted")}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="match">Sort: Match Score</option>
                <option value="posted">Sort: Recently Posted</option>
              </select>
            </div>
          </div>

          {/* Job Recommendation Cards Grid */}
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => {
                const isSaved = savedJobIds.includes(job.id);

                return (
                  <div
                    key={job.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 relative group"
                  >
                    {/* Top Row: Logo, Title, Company, Save Bookmark */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={job.companyLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80"}
                            alt={job.company}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow-xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80";
                            }}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" /> {job.company}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                              {job.jobTitle}
                            </h3>
                          </div>
                        </div>

                        {/* Save Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSaveJob(job.id, job.jobTitle)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isSaved
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600"
                          }`}
                          title={isSaved ? "Saved to job list" : "Save job listing"}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Match Score & Key Metrics Banner */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {job.matchPercentage}% Skill Match
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                          {job.jobType}
                        </span>

                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold">
                          {job.salary}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                        {job.description}
                      </p>

                      {/* Location, Exp, Edu Info */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800 py-2.5 mb-3">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>Experience: {job.experience}</span>
                        </div>
                      </div>

                      {/* Skills Required Tags */}
                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Required Technical Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {job.skillsRequired.map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-slate-200/60 dark:border-slate-700/60"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Apply Bar */}
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Posted {job.postedDate}
                      </span>

                      <a
                        href={job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No job openings found matching your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your search terms, lowering the match percentage requirement, or selecting "All Job Types".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedJobType("all");
                  setMinMatchFilter(0);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
