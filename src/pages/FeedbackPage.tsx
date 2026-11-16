import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Star,
  Trash2,
  Send,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  User,
  Mail,
  Filter,
  Search,
  Sparkles,
  BarChart3,
  ThumbsUp,
  MessageCircle
} from "lucide-react";
import { feedbackService } from "../services/feedbackService";
import { FeedbackInput, FeedbackItem } from "../types";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export const FeedbackPage: React.FC = () => {
  const { user } = useAuth();

  // Active Tab: "user-submit" or "admin-view"
  const [activeTab, setActiveTab] = useState<"user-submit" | "admin-view">("user-submit");

  // User Rating & Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>("General Platform Experience");
  const [userName, setUserName] = useState<string>(user?.name || "");
  const [userEmail, setUserEmail] = useState<string>(user?.email || "");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Admin Feedback List & State
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<{ totalCount: number; averageRating: number; fiveStarCount: number }>({
    totalCount: 0,
    averageRating: 0,
    fiveStarCount: 0,
  });
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters for Admin view
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoadingList(true);
    try {
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data.feedbacks || []);
      setStats(
        data.stats || {
          totalCount: 0,
          averageRating: 0,
          fiveStarCount: 0,
        }
      );
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback comments.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: FeedbackInput = {
        rating,
        category,
        feedbackText,
        userName: userName.trim() || user?.name || "Anonymous User",
        userEmail: userEmail.trim() || user?.email || "user@example.com",
      };

      await feedbackService.submitFeedback(payload);
      toast.success("Thank you! Your feedback has been recorded.");

      // Reset form
      setFeedbackText("");
      setRating(5);
      fetchFeedbacks();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback item?")) return;

    setDeletingId(id);
    try {
      await feedbackService.deleteFeedback(id);
      toast.success("Feedback entry deleted successfully.");
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      fetchFeedbacks();
    } catch (err: any) {
      toast.error("Failed to delete feedback entry.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter admin list
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (ratingFilter > 0 && item.rating !== ratingFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = item.feedbackText.toLowerCase().includes(q);
      const matchName = item.userName.toLowerCase().includes(q);
      const matchEmail = item.userEmail.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchText && !matchName && !matchEmail && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-305 text-xs font-semibold border border-indigo-500/20 mb-2">
          <MessageSquare className="w-3.5 h-3.5" /> User Experience & Platform Feedback
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Feedback & Ratings Center
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Share your experience with our AI Career Advisor, or manage submitted user ratings as an Administrator.
        </p>
      </div>

      {/* Navigation Tabs (User Mode vs Admin Mode) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/50 border border-slate-800 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab("user-submit")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "user-submit"
              ? "bg-slate-900 text-indigo-400 border border-slate-800 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageCircle className="w-4 h-4" /> Give Rating & Feedback
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("admin-view")}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "admin-view"
              ? "bg-slate-900 text-indigo-400 border border-slate-800 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Admin Dashboard ({feedbacks.length})
        </button>
      </div>

      {/* TAB 1: USER SUBMIT FEEDBACK FORM */}
      {activeTab === "user-submit" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Feedback Form Card */}
          <div className="lg:col-span-2 p-6 sm:p-8 premium-card space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Share Your Platform Thoughts
              </h2>
              <p className="text-xs text-slate-450 mt-1 font-semibold">
                Your feedback directly drives our AI model improvements, feature roadmaps, and UI enhancements.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Control */}
              <div>
                <label className="block text-xs font-bold text-slate-350 mb-2">
                  Overall Star Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeStar = hoverRating ? star <= hoverRating : star <= rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                        title={`${star} Star${star > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            activeStar
                              ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                              : "text-slate-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-3 text-xs font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    {rating === 5 && "⭐ Excellent (5/5)"}
                    {rating === 4 && "👍 Very Good (4/5)"}
                    {rating === 3 && "👌 Satisfactory (3/5)"}
                    {rating === 2 && "⚠️ Needs Improvement (2/5)"}
                    {rating === 1 && "👎 Unsatisfactory (1/5)"}
                  </span>
                </div>
              </div>

              {/* Feedback Category */}
              <div>
                <label className="block text-xs font-bold text-slate-350 mb-1.5">
                  Category / Topic:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <option value="General Platform Experience">General Platform Experience</option>
                  <option value="AI Career Guidance & Roadmaps">AI Career Guidance & Roadmaps</option>
                  <option value="Resume Analyzer & ATS Scoring">Resume Analyzer & ATS Scoring</option>
                  <option value="Mock Interview Prep Engine">Mock Interview Prep Engine</option>
                  <option value="Skill Gap & Course Recommendations">Skill Gap & Course Recommendations</option>
                  <option value="Bug Report or Feature Request">Bug Report or Feature Request</option>
                </select>
              </div>

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Your Name:
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full premium-input px-3.5 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address:
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full premium-input px-3.5 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
                  />
                </div>
              </div>

              {/* Feedback Text Area */}
              <div>
                <label className="block text-xs font-bold text-slate-350 mb-1.5">
                  Detailed Feedback Comments:
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you liked, what could be improved, or any bugs encountered during your career exploration..."
                  className="w-full p-3.5 premium-input text-xs outline-none focus:bg-slate-950/80 leading-relaxed resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-indigo-300" />}
                <span>Submit Feedback & Rating</span>
              </button>
            </form>
          </div>

          {/* Right Metrics & Tips Sidebar */}
          <div className="space-y-6">
            <div className="p-6 premium-card space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Platform Ratings Summary
              </h3>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-3xl font-black text-amber-400">
                  {stats.averageRating || "4.8"}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Based on {stats.totalCount || feedbacks.length} user reviews
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> 5-Star Reviews:
                  </span>
                  <span className="font-bold text-white">
                    {stats.fiveStarCount || feedbacks.filter((f) => f.rating === 5).length}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Feedbacks:</span>
                  <span className="font-bold text-white">{stats.totalCount}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600/85 to-purple-700/85 text-white border border-indigo-500/30 shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
                Your Voice Matters
              </span>
              <h4 className="text-base font-extrabold leading-snug">
                Helping Us Build the World's Best AI Career Platform
              </h4>
              <p className="text-xs text-indigo-150 leading-relaxed font-semibold">
                All feedback is monitored directly by our product engineers to refine career accuracy, resume parsing, and interview models.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN VIEW & DELETE FEEDBACK */}
      {activeTab === "admin-view" && (
        <div className="space-y-6">
          {/* Admin Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 premium-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-405 uppercase tracking-wider">Total Feedback</span>
                <p className="text-2xl font-black text-white mt-0.5">{stats.totalCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 premium-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Average Rating</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5 flex items-center gap-1">
                  {stats.averageRating} <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Star className="w-5 h-5 fill-current animate-pulse" />
              </div>
            </div>

            <div className="p-5 premium-card flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-405 uppercase tracking-wider">5-Star Satisfaction</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">
                  {stats.totalCount > 0 ? Math.round((stats.fiveStarCount / stats.totalCount) * 100) : 100}%
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Admin Search & Filter Bar */}
          <div className="p-4 premium-card flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-450 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feedback comments, user, or category..."
                className="w-full pl-9 pr-3 py-2 premium-input text-xs outline-none focus:bg-slate-950/80"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="px-3.5 py-2 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
              >
                <option value={0}>All Ratings</option>
                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars Only</option>
                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                <option value={3}>⭐⭐⭐ 3 Stars</option>
                <option value={2}>⭐⭐ 2 Stars</option>
                <option value={1}>⭐ 1 Star</option>
              </select>
            </div>
          </div>

          {/* Admin Feedback Table / List */}
          {filteredFeedbacks.length > 0 ? (
            <div className="space-y-4">
              {filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-6 premium-card space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-300 font-bold text-sm flex items-center justify-center shrink-0 border border-indigo-500/20">
                        {fb.userName ? fb.userName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{fb.userName}</h4>
                        <span className="text-[11px] text-slate-400 block font-medium">{fb.userEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Star Rating Badge */}
                      <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                        <span>{fb.rating}.0</span>
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>

                      {/* Category Badge */}
                      <span className="px-3 py-1 rounded-xl bg-slate-900 text-slate-350 text-xs font-bold border border-slate-800">
                        {fb.category}
                      </span>

                      {/* Delete Button (Admin Action) */}
                      <button
                        type="button"
                        onClick={() => handleDelete(fb.id)}
                        disabled={deletingId === fb.id}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-600/20 text-rose-450 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Feedback"
                      >
                        {deletingId === fb.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Feedback Body */}
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                    "{fb.feedbackText}"
                  </p>

                  <div className="text-[11px] text-slate-500 pt-1 font-semibold">
                    Submitted on: {new Date(fb.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center premium-card space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-505 mx-auto animate-pulse" />
              <h3 className="text-base font-bold text-white">No feedback entries found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                No feedback matches your search or filter criteria. Try resetting filters or submit a new test feedback.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
