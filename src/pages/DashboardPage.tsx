import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCareer } from "../hooks/useCareer";
import { careerService } from "../services/careerService";
import { StatCard } from "../components/StatCard";
import { CareerCard } from "../components/CareerCard";
import toast from "react-hot-toast";
import {
  Compass,
  Map,
  FileText,
  Target,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  User as UserIcon,
  Award,
  Clock,
  Edit3,
  Trash2,
  Zap,
  Briefcase,
  IndianRupee,
  X,
  BookOpen,
  ChevronRight,
  AlertCircle,
  GraduationCap,
  Layers,
} from "lucide-react";
import { CareerRecommendation } from "../types";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    setLatestAssessment,
    setActiveRoadmap,
    bookmarks,
    removeBookmark,
    recentlyViewed,
    addRecentlyViewed,
    careerGoal,
    updateCareerGoal,
    latestAssessment,
    activeRoadmap,
    latestResume,
  } = useCareer();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGoalEditing, setIsGoalEditing] = useState<boolean>(false);

  // Goal Edit State
  const [goalRole, setGoalRole] = useState(careerGoal.targetRole);
  const [goalSalary, setGoalSalary] = useState(careerGoal.targetSalary);
  const [goalDate, setGoalDate] = useState(careerGoal.targetDate);
  const [goalFocus, setGoalFocus] = useState(careerGoal.keyFocus);

  useEffect(() => {
    const loadDefaultCareerData = async () => {
      try {
        if (latestAssessment?.recommendations?.length) {
          setRecommendations(latestAssessment.recommendations);
          setLoading(false);
          return;
        }

        const data = await careerService.submitQuiz({
          skills: user?.skills || ["JavaScript", "React", "TypeScript", "Problem Solving"],
          interests: ["Software Engineering", "Artificial Intelligence", "Web Systems"],
          education: user?.education || "Bachelor's Degree",
          experienceYears: user?.experienceLevel || "Entry Level",
          workStyle: "Hybrid / Remote",
          values: ["High Growth", "Technical Mastery", "Competitive Salary"],
          preferredIndustry: "Technology",
        });
        setLatestAssessment(data);
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error("Dashboard assessment load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadDefaultCareerData();
  }, [user, latestAssessment, setLatestAssessment]);

  const handleGenerateRoadmap = async (title: string) => {
    try {
      toast.loading("Generating AI Roadmap...", { id: "roadmap-gen" });
      const roadmap = await careerService.generateRoadmap(title, user?.experienceLevel || "Entry Level");
      setActiveRoadmap(roadmap);
      toast.success(`Roadmap for ${title} created!`, { id: "roadmap-gen" });
      navigate("/roadmap");
    } catch (err: any) {
      toast.error("Failed to generate roadmap", { id: "roadmap-gen" });
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    updateCareerGoal({
      targetRole: goalRole,
      targetSalary: goalSalary,
      targetDate: goalDate,
      keyFocus: goalFocus,
    });
    setIsGoalEditing(false);
    toast.success("Career goal updated!");
  };

  // Calculate Progress Stats
  const quizDone = Boolean(latestAssessment);
  const roadmapDone = Boolean(activeRoadmap);
  const resumeDone = Boolean(latestResume);

  let progressPercent = 25; // Base profile
  if (quizDone) progressPercent += 25;
  if (roadmapDone) progressPercent += 25;
  if (resumeDone) progressPercent += 25;

  const savedCareersList = bookmarks.filter((b) => b.itemType === "career");

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Message Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1438] via-[#090d24] to-[#050713] border border-white/[0.1] p-6 sm:p-8 shadow-2xl">
        {/* Background ambient radial glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-extrabold tracking-widest uppercase border border-indigo-500/30 shadow-sm shadow-indigo-500/10">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              Autonomous Career Intelligence Active
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 uppercase tracking-wider">
              Student Workspace
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 bg-clip-text text-transparent">{user?.name || "Student Explorer"}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-2xl font-normal">
            Targeting{" "}
            <span className="font-bold text-indigo-300 border-b border-indigo-500/40 pb-0.5">
              {careerGoal.targetRole || user?.targetRole || "Software Engineer"}
            </span>
            . Your AI profile has analyzed <strong>{user?.skills?.length || 4} skills</strong> to recommend optimized learning pathways and salary targets.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/assessment"
              className="px-5 py-2.5 rounded-xl btn-glow-primary text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Retake Career Assessment</span>
            </Link>
            <Link
              to="/roadmap"
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 font-bold text-xs border border-white/[0.1] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Map className="w-4 h-4 text-indigo-400" />
              <span>View Active Roadmap</span>
            </Link>
            <Link
              to="/resume"
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 font-bold text-xs border border-white/[0.1] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Analyze Resume ATS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Dashboard Statistics Grid */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3.5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" /> Key Career Performance Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Career Match Index"
            value={`${recommendations[0]?.matchScore || 94}%`}
            subtitle={`Top fit: ${recommendations[0]?.title || "AI Full Stack Engineer"}`}
            icon={Compass}
            badge="High Alignment"
            color="indigo"
          />
          <StatCard
            title="Skills Profile"
            value={user?.skills?.length || 5}
            subtitle={`${recommendations[0]?.missingSkills?.length || 2} missing skill gaps identified`}
            icon={Target}
            color="emerald"
          />
          <StatCard
            title="Target Salary Goal"
            value={careerGoal.targetSalary}
            subtitle={`Market band: ₹8,00,000 – ₹18,00,000/yr`}
            icon={TrendingUp}
            color="violet"
          />
          <StatCard
            title="Readiness Progress"
            value={`${progressPercent}%`}
            subtitle={`${quizDone ? "Quiz" : ""} ${roadmapDone ? "• Roadmap" : ""} ${resumeDone ? "• Resume" : ""}`}
            icon={CheckCircle2}
            color="amber"
          />
        </div>
      </div>

      {/* Middle Grid: User Profile Card & Career Goal Card & Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. User Profile Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4" /> Student Profile Card
              </span>
              <Link
                to="/profile"
                className="text-xs font-semibold text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </Link>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight">{user?.name || "Student Name"}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                  <Briefcase className="w-3 h-3 text-indigo-400" />
                  {user?.targetRole || "Software Developer"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-white/[0.06] pt-3.5">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Education:
                </span>
                <span className="font-bold text-white">{user?.education || "Bachelor's Degree"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-500" /> Level:
                </span>
                <span className="font-bold text-white">{user?.experienceLevel || "Entry Level"}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1.5 font-semibold">Acquired Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(user?.skills && user.skills.length > 0
                    ? user.skills
                    : ["JavaScript", "React", "HTML/CSS", "Problem Solving"]
                  ).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {user?.bio && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1 font-semibold">Bio:</span>
                  <p className="text-slate-300 italic text-[11px] leading-relaxed line-clamp-2">
                    "{user.bio}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <Link
            to="/profile"
            className="mt-5 w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white text-xs font-bold text-center border border-white/[0.06] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Update Student Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. Career Goal Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Target className="w-4 h-4" /> Career Target Goal
              </span>
              <button
                onClick={() => setIsGoalEditing(!isGoalEditing)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                {isGoalEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{isGoalEditing ? "Cancel" : "Update Goal"}</span>
              </button>
            </div>

            {isGoalEditing ? (
              <form onSubmit={handleSaveGoal} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Role</label>
                  <input
                    type="text"
                    value={goalRole}
                    onChange={(e) => setGoalRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-black/40 text-white outline-none focus:border-indigo-500"
                    placeholder="e.g. AI Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Salary</label>
                  <input
                    type="text"
                    value={goalSalary}
                    onChange={(e) => setGoalSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-black/40 text-white outline-none focus:border-indigo-500"
                    placeholder="e.g. ₹12,50,000/year"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Timeline</label>
                  <input
                    type="text"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-black/40 text-white outline-none focus:border-indigo-500"
                    placeholder="e.g. 6 Months"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Key Focus Milestone</label>
                  <input
                    type="text"
                    value={goalFocus}
                    onChange={(e) => setGoalFocus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/[0.1] bg-black/40 text-white outline-none focus:border-indigo-500"
                    placeholder="e.g. Build 2 Full Stack Apps"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 btn-glow-primary text-white font-bold rounded-xl transition-all mt-2 cursor-pointer"
                >
                  Save Goal
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
                    Primary Target Role
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{careerGoal.targetRole}</h3>
                  <p className="text-xs text-amber-200 mt-1 flex items-center gap-1.5 font-bold">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Target Salary: {careerGoal.targetSalary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> Timeline
                    </span>
                    <span className="font-extrabold text-white mt-0.5 block">{careerGoal.targetDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-400" /> Focus Target
                    </span>
                    <span className="font-extrabold text-white truncate mt-0.5 block">{careerGoal.keyFocus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Goal Status: <strong className="text-emerald-400 font-bold">On Track</strong></span>
            <Link to="/roadmap" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Execute Roadmap →
            </Link>
          </div>
        </div>

        {/* 5. Progress Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Career Readiness Progress
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-black/50 rounded-full h-3 mb-4 overflow-hidden p-0.5 border border-white/[0.08]">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <span className="flex items-center gap-2 text-slate-200 font-medium">
                  <CheckCircle2 className={`w-4 h-4 ${quizDone ? "text-emerald-400" : "text-slate-500"}`} />
                  AI Career Quiz Assessment
                </span>
                <span className={`font-bold text-[11px] ${quizDone ? "text-emerald-400" : "text-slate-500"}`}>
                  {quizDone ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <span className="flex items-center gap-2 text-slate-200 font-medium">
                  <CheckCircle2 className={`w-4 h-4 ${roadmapDone ? "text-emerald-400" : "text-slate-500"}`} />
                  Custom Learning Roadmap
                </span>
                <span className={`font-bold text-[11px] ${roadmapDone ? "text-emerald-400" : "text-slate-500"}`}>
                  {roadmapDone ? "Active" : "Not Started"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/[0.04]">
                <span className="flex items-center gap-2 text-slate-200 font-medium">
                  <CheckCircle2 className={`w-4 h-4 ${resumeDone ? "text-emerald-400" : "text-slate-500"}`} />
                  Resume ATS Analysis
                </span>
                <span className={`font-bold text-[11px] ${resumeDone ? "text-emerald-400" : "text-slate-500"}`}>
                  {resumeDone ? "Optimized" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <Link
              to={!quizDone ? "/assessment" : !roadmapDone ? "/roadmap" : "/resume"}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <span>Next Recommended Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. AI Recommendation Summary & Top Fit Cards */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-extrabold text-white tracking-tight">AI Recommendation Summary</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Top matched career pathways tailored for {user?.name || "your student profile"} by Gemini AI
            </p>
          </div>
          <Link
            to="/assessment"
            className="px-4 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/25 transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Retake AI Quiz</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.slice(0, 4).map((career) => (
              <CareerCard
                key={career.id || career.title}
                career={career}
                onGenerateRoadmap={handleGenerateRoadmap}
              />
            ))}
          </div>
        )}
      </div>

      {/* 7. Saved Careers & 8. Recently Viewed Careers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Careers */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
              <h3 className="font-extrabold text-white text-base tracking-tight">Saved Careers</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              {savedCareersList.length} Saved
            </span>
          </div>

          {savedCareersList.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-white/[0.08] rounded-xl space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">No saved careers yet.</p>
              <p className="text-[11px] text-slate-500">Click the bookmark icon on any career card to save it here.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {savedCareersList.map((bm) => (
                <div
                  key={bm.id}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                      {bm.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{bm.data?.salaryRange || "Competitive Salary"}</span>
                      {bm.data?.matchScore && (
                        <span className="text-indigo-300 font-semibold">
                          • {bm.data.matchScore}% Match
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateRoadmap(bm.title)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Map className="w-3 h-3" />
                      <span>Roadmap</span>
                    </button>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Viewed Careers */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <h3 className="font-extrabold text-white text-base tracking-tight">Recently Viewed Careers</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">History ({recentlyViewed.length})</span>
          </div>

          {recentlyViewed.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-white/[0.08] rounded-xl space-y-2">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">No recently viewed careers.</p>
              <p className="text-[11px] text-slate-500">Careers you explore will automatically appear here for quick access.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {recentlyViewed.map((career, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-3 hover:border-violet-500/30 transition-all group"
                >
                  <div>
                    <h4 className="font-bold text-xs text-white group-hover:text-violet-300 transition-colors">
                      {career.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 mt-0.5 block truncate max-w-xs">
                      {career.salaryRange} • {career.matchScore}% Fit Index
                    </span>
                  </div>

                  <button
                    onClick={() => handleGenerateRoadmap(career.title)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-violet-600 hover:text-white text-slate-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
