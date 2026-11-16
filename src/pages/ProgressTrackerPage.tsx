import React, { useState, useEffect, useContext } from "react";
import { CheckSquare, Plus, Trash2, Award, BookOpen, Star, Send, CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { CareerContext } from "../context/CareerContext";
import { feedbackService } from "../services/feedbackService";
import { careerService } from "../services/careerService";
import { toast } from "react-hot-toast";

interface Course {
  id: string;
  title: string;
  platform: string;
  date: string;
}

export const ProgressTrackerPage: React.FC = () => {
  const { user } = useAuth();
  const careerContext = useContext(CareerContext);

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem("student_course_milestones");
      return saved
        ? JSON.parse(saved)
        : [
            { id: "1", title: "Complete React Developer in 2026", platform: "Udemy", date: "2026-02-15" },
            { id: "2", title: "Introduction to PostgreSQL & DB Design", platform: "Coursera", date: "2026-04-10" },
          ];
    } catch {
      return [];
    }
  });

  const [mockCompleted, setMockCompleted] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [resumeData, setResumeData] = useState<any>(null);

  // Form states
  const [cTitle, setCTitle] = useState("");
  const [cPlatform, setCPlatform] = useState("");
  const [cDate, setCDate] = useState("");

  // Feedback states
  const [fbMessage, setFbMessage] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbCategory, setFbCategory] = useState("Platform Performance");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMockCompleted(localStorage.getItem("mock_interview_completed") === "true");
    }

    // Fetch assessment and resume history
    const loadProgressData = async () => {
      try {
        const assessments = await careerService.getAssessmentHistory();
        if (assessments && assessments.length > 0) {
          setAssessmentData(assessments[0]); // Get the latest one
        }

        const resumes = await careerService.getResumeHistory();
        if (resumes && resumes.length > 0) {
          setResumeData(resumes[0]); // Get the latest one
        }
      } catch (err) {
        console.warn("Failed to load assessment or resume history", err);
      }
    };
    loadProgressData();
  }, []);

  const addCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim() || !cPlatform.trim()) return;

    const newC: Course = {
      id: Date.now().toString(),
      title: cTitle,
      platform: cPlatform,
      date: cDate || new Date().toISOString().split("T")[0],
    };

    const updated = [...courses, newC];
    setCourses(updated);
    localStorage.setItem("student_course_milestones", JSON.stringify(updated));

    setCTitle("");
    setCPlatform("");
    setCDate("");
    toast.success("Course milestone logged!");
  };

  const removeCourse = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem("student_course_milestones", JSON.stringify(updated));
    toast.success("Course milestone removed");
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) {
      toast.error("Feedback message cannot be empty");
      return;
    }

    setSubmittingFeedback(true);
    try {
      await feedbackService.submitFeedback({
        rating: fbRating,
        feedbackText: fbMessage,
        category: fbCategory,
      });
      toast.success("Thank you for your valuable feedback!");
      setFbMessage("");
      setFbRating(5);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const isProfileComplete = user && user.name && user.skills && user.skills.length > 0;
  const isAssessmentComplete = assessmentData !== null || (careerContext?.latestAssessment !== null && careerContext?.latestAssessment !== undefined);
  const isResumeComplete = resumeData !== null || (careerContext?.latestResume !== null && careerContext?.latestResume !== undefined);

  // Compute skill competency scores
  let skillScores: Record<string, number> = {};
  const activeAssessment = assessmentData || careerContext?.latestAssessment;

  if (activeAssessment && activeAssessment.recommendations && activeAssessment.recommendations.length > 0) {
    // Map skills from assessment to score percentages
    const primarySkills = activeAssessment.quizData?.skills || [];
    primarySkills.forEach((skill: string, index: number) => {
      skillScores[skill] = Math.max(6, 10 - index); // Fallback mock scoring: 10, 9, 8...
    });
  } else if (user && user.skills) {
    // Fallback based on user skills
    user.skills.forEach((skill: string, index: number) => {
      skillScores[skill] = Math.max(7, 10 - index);
    });
  } else {
    // Default list
    skillScores = { "React / Frontend": 8, "Node.js / Express": 7, "SQL Databases": 6, "Algorithms": 9 };
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Progress Tracker</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor your core portal onboarding status, academic milestones, and competency levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklists & milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Platform Checklists */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-emerald-500" />
              Platform Onboarding & Goals Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your onboarding and optimization tasks across the AI Career System.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Milestone 1 */}
              <div
                className={`p-4 border rounded-xl flex items-start gap-3 transition-all ${
                  isProfileComplete
                    ? "bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-500/30"
                    : "bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
                }`}
              >
                {isProfileComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Student Profile Setup</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    Provide target role, college degrees, and professional skills in the profile tab.
                  </p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono inline-block ${
                    isProfileComplete ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {isProfileComplete ? "COMPLETED" : "PENDING"}
                  </span>
                </div>
              </div>

              {/* Milestone 2 */}
              <div
                className={`p-4 border rounded-xl flex items-start gap-3 transition-all ${
                  isAssessmentComplete
                    ? "bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-500/30"
                    : "bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
                }`}
              >
                {isAssessmentComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Skills Assessment Taken</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    Complete the diagnostics career quiz to map your recommendations.
                  </p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono inline-block ${
                    isAssessmentComplete ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {isAssessmentComplete ? "VERIFIED" : "PENDING"}
                  </span>
                </div>
              </div>

              {/* Milestone 3 */}
              <div
                className={`p-4 border rounded-xl flex items-start gap-3 transition-all ${
                  isResumeComplete
                    ? "bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-500/30"
                    : "bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
                }`}
              >
                {isResumeComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">ATS Resume Scanner Audit</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    Submit your resume to evaluate keyword match scores and formatting advice.
                  </p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono inline-block ${
                    isResumeComplete ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {isResumeComplete ? "COMPLETED" : "PENDING"}
                  </span>
                </div>
              </div>

              {/* Milestone 4 */}
              <div
                className={`p-4 border rounded-xl flex items-start gap-3 transition-all ${
                  mockCompleted
                    ? "bg-emerald-50/15 dark:bg-emerald-950/10 border-emerald-500/30"
                    : "bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
                }`}
              >
                {mockCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">AI Mock Interview Drill</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                    Answer real-time practice questions and get AI evaluations.
                  </p>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono inline-block ${
                    mockCompleted ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}>
                    {mockCompleted ? "DRILL COMPLETED" : "PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Milestones Manager */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
              Completed Semester Courses & Certs Logger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record external certifications, college workshops, or online masterclasses completed during this semester.
            </p>

            <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Course / Certification Title"
                value={cTitle}
                onChange={(e) => setCTitle(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
              />
              <input
                type="text"
                required
                placeholder="Provider (Coursera, Udemy, etc.)"
                value={cPlatform}
                onChange={(e) => setCPlatform(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={cDate}
                  onChange={(e) => setCDate(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 pt-2">
              {courses.length > 0 ? (
                courses.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100">{c.title}</h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                        {c.platform} &bull; Finished on {c.date}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCourse(c.id)}
                      className="text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No logged course milestones yet.</p>
              )}
            </div>
          </div>

          {/* Competency Audit Graph */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-amber-500" />
                Skills Competency Audit Graph
              </h3>
              {isAssessmentComplete && (
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Synced with AI Assessment
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated scoring indices across your primary technical sectors and competencies.
            </p>

            <div className="space-y-4.5 pt-2">
              {Object.entries(skillScores).map(([skill, score]) => {
                const scorePercent = score * 10;
                return (
                  <div key={skill} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{score} / 10</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-amber-500 dark:bg-amber-400 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${scorePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback Submission */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-emerald-500" />
              Platform Experience Feedback
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Encountered any bugs, database sync problems, or have feature proposals? Share directly with our moderator group.
            </p>

            <form onSubmit={submitFeedback} className="space-y-4 pt-2">
              {/* Stars Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      type="button"
                      key={stars}
                      onClick={() => setFbRating(stars)}
                      className="text-slate-300 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          fbRating >= stars ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Category</label>
                <select
                  value={fbCategory}
                  onChange={(e) => setFbCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                >
                  <option value="Platform Performance">Platform Performance</option>
                  <option value="AI Recommendation Quality">AI Recommendation Accuracy</option>
                  <option value="Resume Analyzer ATS Rating">ATS Evaluation Accuracy</option>
                  <option value="Mock Interview Prep Feedback">Mock Interviews</option>
                  <option value="Other / General Query">General Query</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Comments</label>
                <textarea
                  required
                  rows={4}
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  placeholder="Tell us what you think or report database issues..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submittingFeedback}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
