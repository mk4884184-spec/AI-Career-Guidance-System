import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  Loader2,
  Star,
  Clock,
  ExternalLink,
  Award,
  CheckCircle2,
  Bookmark,
  Search,
  BookOpen,
  IndianRupee,
  Plus,
  X,
  Layers,
  Zap,
  Filter
} from "lucide-react";
import { courseService } from "../services/courseService";
import { CourseRecommendation, CourseRecommendationResponse } from "../types";
import toast from "react-hot-toast";

export const CourseRecommendationPage: React.FC = () => {
  const [careerGoal, setCareerGoal] = useState<string>("Full Stack Developer");
  const [missingSkills, setMissingSkills] = useState<string[]>([
    "Docker & Containers",
    "System Design",
    "GraphQL APIs",
    "AWS Cloud Services"
  ]);
  const [newSkillInput, setNewSkillInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<CourseRecommendationResponse | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<"all" | "free" | "paid" | "cert">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Bookmarked Courses (IDs)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("bookmarked_courses");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-fetch initial recommendations on mount
  useEffect(() => {
    handleFetchRecommendations();
  }, []);

  const handleFetchRecommendations = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await courseService.getRecommendations(careerGoal, missingSkills);
      setData(res);
      toast.success("Updated personalized course recommendations!");
    } catch (err) {
      console.error("Course recommendation fetch error", err);
      toast.error("Failed to load course recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !missingSkills.includes(trimmed)) {
      setMissingSkills([...missingSkills, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setMissingSkills(missingSkills.filter((s) => s !== skillToRemove));
  };

  const toggleBookmark = (courseId: string) => {
    let updated: string[];
    if (bookmarkedIds.includes(courseId)) {
      updated = bookmarkedIds.filter((id) => id !== courseId);
      toast.success("Removed course from saved list.");
    } else {
      updated = [...bookmarkedIds, courseId];
      toast.success("Course saved to your learning list!");
    }
    setBookmarkedIds(updated);
    localStorage.setItem("bookmarked_courses", JSON.stringify(updated));
  };

  // Compile all courses
  const allCourses: CourseRecommendation[] = [
    ...(data?.freeCourses || []),
    ...(data?.paidCourses || []),
    ...(data?.certifications || []),
  ];

  // Filter logic
  const filteredCourses = allCourses.filter((course) => {
    // Tab filter
    if (activeTab === "free" && course.type !== "Free") return false;
    if (activeTab === "paid" && course.type !== "Paid") return false;
    if (activeTab === "cert" && course.type !== "Certification") return false;

    // Difficulty filter
    if (difficultyFilter !== "all" && course.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchProvider = course.provider.toLowerCase().includes(q);
      const matchSkills = course.skillsCovered.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchProvider && !matchSkills) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
          <GraduationCap className="w-3.5 h-3.5" /> AI Course & Certification Recommender
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Personalized Skill Gap Learning Paths
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Discover curated free courses, in-depth paid masterclasses, and industry professional certifications tailored specifically to your career goal and missing skills.
        </p>
      </div>

      {/* Inputs Form Section */}
      <form
        onSubmit={handleFetchRecommendations}
        className="p-6 sm:p-7 premium-card space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Career Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Target Career Goal
            </label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer, Cloud Architect, DevOps Lead..."
              className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
              required
            />
          </div>

          {/* Add Missing Skill Input */}
          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Add Skill Gap / Missing Competency
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a missing skill & press enter (e.g. Kubernetes)..."
                className="flex-1 px-4 py-2.5 premium-input text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Selected Missing Skill Badges */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2">
            Current Missing Skills ({missingSkills.length}):
          </label>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-505/10 text-indigo-300 text-xs font-bold border border-indigo-500/20"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 transition-colors p-0.5 rounded-md cursor-pointer"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {missingSkills.length === 0 && (
              <p className="text-xs text-amber-400 font-medium animate-pulse">
                No missing skills selected. Add at least one skill gap above to generate hyper-targeted course recommendations!
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2 border-t border-slate-800/60">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-405 animate-pulse" />}
            <span>Get AI Recommendation Course Kit</span>
          </button>
        </div>
      </form>

      {/* Main Content Area */}
      {data && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 premium-card border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-450 block uppercase tracking-widest">
                  Free Courses
                </span>
                <span className="text-2xl font-black text-white mt-0.5 block">
                  {data.freeCourses?.length || 0} Recommended
                </span>
                <span className="text-[11px] text-emerald-450 font-medium">Zero-cost open learning</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BookOpen className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="p-5 premium-card border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-widest">
                  Paid Masterclasses
                </span>
                <span className="text-2xl font-black text-white mt-0.5 block">
                  {data.paidCourses?.length || 0} Recommended
                </span>
                <span className="text-[11px] text-indigo-400 font-medium font-medium">In-depth labs & mentorship</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 premium-card border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-widest">
                  Certifications
                </span>
                <span className="text-2xl font-black text-white mt-0.5 block">
                  {data.certifications?.length || 0} Recommended
                </span>
                <span className="text-[11px] text-amber-400 font-medium">Industry official credentials</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filtering & Search Toolbar */}
          <div className="p-4 premium-card flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/65 p-1.5 rounded-xl border border-slate-800/80 w-full md:w-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "all"
                    ? "bg-slate-900 text-indigo-405 border border-slate-800 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Recommendations ({allCourses.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("free")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "free"
                    ? "bg-slate-900 text-emerald-400 border border-slate-800 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Free Courses ({data.freeCourses?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("paid")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "paid"
                    ? "bg-slate-900 text-indigo-405 border border-slate-800 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Paid Masterclasses ({data.paidCourses?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cert")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "cert"
                    ? "bg-slate-900 text-amber-400 border border-slate-800 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Certifications ({data.certifications?.length || 0})
              </button>
            </div>

            {/* Right Controls: Search & Difficulty Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search course title or skill..."
                  className="w-full pl-9 pr-3 py-2 premium-input text-xs outline-none focus:bg-slate-950/80"
                />
              </div>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Course Cards Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isBookmarked = bookmarkedIds.includes(course.id);
                const typeBadgeStyle =
                  course.type === "Free"
                    ? "bg-emerald-500 text-white"
                    : course.type === "Paid"
                    ? "bg-indigo-605 text-white shadow-md shadow-indigo-600/10"
                    : "bg-amber-500 text-white";

                return (
                  <div
                    key={course.id}
                    className="group rounded-3xl premium-card shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Course Image Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-805">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback image if unsplash load fails
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        {/* Top Overlay Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${typeBadgeStyle}`}>
                            {course.type}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleBookmark(course.id)}
                            className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                              isBookmarked
                                ? "bg-amber-500 text-white border border-amber-400/50"
                                : "bg-slate-900/60 hover:bg-slate-900 text-white border border-slate-800"
                            }`}
                            title={isBookmarked ? "Remove Bookmark" : "Save Course"}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bottom Overlay Provider Name */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="font-bold px-2 py-0.5 rounded bg-slate-900/70 border border-white/20">
                            {course.provider}
                          </span>
                          {course.priceInfo && (
                            <span className="font-extrabold text-amber-300 text-xs">
                              {course.priceInfo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Card Body */}
                      <div className="p-5 space-y-3.5">
                        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Rating, Duration & Difficulty metadata */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-semibold border-y border-slate-800/80 py-2.5">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{course.rating.toFixed(1)}</span>
                            {course.reviewCount && (
                              <span className="text-[11px] text-slate-500 font-normal">
                                ({course.reviewCount.toLocaleString()})
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{course.duration}</span>
                          </div>

                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-bold border border-slate-800">
                            {course.difficulty}
                          </span>
                        </div>

                        {/* Skills Covered Tags */}
                        {course.skillsCovered && course.skillsCovered.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Skills Addressed:
                            </span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {course.skillsCovered.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Enrollment Button */}
                    <div className="p-5 pt-0">
                      <a
                        href={course.courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-205 text-xs font-bold border border-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                      >
                        <span>View / Enroll on {course.provider}</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center premium-card space-y-3">
              <BookOpen className="w-10 h-10 text-slate-505 mx-auto animate-pulse" />
              <h3 className="text-base font-bold text-white">
                No courses match your active search filters
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                Try clearing search keywords or switching difficulty/category tabs to view all available recommendations.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  setDifficultyFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl bg-indigo-650 text-white text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
