import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Send,
  Award,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Zap,
  Target,
  Clock,
  Layers
} from "lucide-react";
import { careerService } from "../services/careerService";
import { InterviewPrepData, InterviewQuestion, InterviewAnswerEvaluation } from "../types";
import toast from "react-hot-toast";

export const InterviewPrepPage: React.FC = () => {
  const [targetRole, setTargetRole] = useState<string>("Senior Full Stack Developer");
  const [experienceLevel, setExperienceLevel] = useState<string>("Mid Level");
  const [loading, setLoading] = useState<boolean>(false);
  const [prepData, setPrepData] = useState<InterviewPrepData | null>(null);

  // Tab Mode: 'questions' (Question Bank & Answers) or 'mock' (Mock Interview Simulation)
  const [activeTab, setActiveTab] = useState<"questions" | "mock">("questions");

  // Question Bank Filter
  const [filterType, setFilterType] = useState<"all" | "technical" | "hr" | "behavioral">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock Interview State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Map of questionId -> InterviewAnswerEvaluation
  const [evaluations, setEvaluations] = useState<Record<string, InterviewAnswerEvaluation>>({});

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await careerService.generateInterviewPrep(targetRole, experienceLevel);
      setPrepData(data);
      if (data.questions && data.questions.length > 0) {
        setExpandedId(data.questions[0].id);
        setCurrentQuestionIndex(0);
      }
      setEvaluations({});
      toast.success(`Generated ${data.questions?.length || 6} interview questions for ${data.targetRole}!`);
    } catch (err) {
      console.error("Interview prep error", err);
      toast.error("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnswer = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Sample answer copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakQuestion = (text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluateAnswer = async (q: InterviewQuestion) => {
    if (!userAnswer || userAnswer.trim().length < 5) {
      toast.error("Please enter a detailed response before submitting for AI evaluation.");
      return;
    }

    setEvaluating(true);
    try {
      const evalRes = await careerService.evaluateInterviewAnswer(
        q.question,
        userAnswer,
        q.type,
        q.sampleAnswer
      );

      const evaluation: InterviewAnswerEvaluation = {
        questionId: q.id,
        userAnswer,
        score: evalRes.score || 78,
        feedbackSummary: evalRes.feedbackSummary || "Good answer structure.",
        strengths: evalRes.strengths || [],
        areasToImprove: evalRes.areasToImprove || [],
        keyKeywordsCovered: evalRes.keyKeywordsCovered || [],
        missingKeywords: evalRes.missingKeywords || [],
        improvedAnswer: evalRes.improvedAnswer || q.sampleAnswer || "",
      };

      setEvaluations((prev) => ({
        ...prev,
        [q.id]: evaluation,
      }));

      toast.success("Answer evaluated with AI feedback!");
    } catch (err) {
      console.error("Evaluation error", err);
      toast.error("Failed to evaluate answer.");
    } finally {
      setEvaluating(false);
    }
  };

  const questionsList = prepData?.questions || [];
  const filteredQuestions = questionsList.filter((q) => {
    if (filterType === "all") return true;
    if (filterType === "technical") return q.type === "technical";
    if (filterType === "hr") return q.type === "hr";
    if (filterType === "behavioral") return q.type === "behavioral" || q.type === "situational";
    return true;
  });

  const currentQ = questionsList[currentQuestionIndex];
  const currentEval = currentQ ? evaluations[currentQ.id] : undefined;

  // Calculate overall mock session score
  const evaluatedCount = Object.keys(evaluations).length;
  const evalList = Object.values(evaluations) as InterviewAnswerEvaluation[];
  const totalScore = evalList.reduce((acc, item) => acc + (item.score || 0), 0);
  const avgScore = evaluatedCount > 0 ? Math.round(totalScore / evaluatedCount) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800 mb-2">
          <MessageSquare className="w-3.5 h-3.5" /> AI Interview Prep & Mock Simulator
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Role-Specific Interview Preparation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Prepare technical, HR, and behavioral questions with AI sample answers, or launch the interactive Mock Interview Mode for real-time scoring and feedback.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="p-6 premium-card flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-350 mb-1.5">Target Job Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer, Product Manager..."
            className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-355 mb-1.5">Seniority Level</label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
          >
            <option value="Entry Level">Entry Level (0-2 Yrs)</option>
            <option value="Mid Level">Mid Level (3-5 Yrs)</option>
            <option value="Senior Staff Level">Senior / Lead (5+ Yrs)</option>
          </select>
        </div>

        <div className="sm:self-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-650 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            <span>Generate Interview Kit</span>
          </button>
        </div>
      </form>

      {/* Main Interface Tabs */}
      {prepData && (
        <div className="space-y-6">
          {/* View Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("questions")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "questions"
                    ? "bg-slate-900 text-amber-400 border border-slate-800 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4 text-amber-405" /> Practice Questions & AI Answers
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("mock")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "mock"
                    ? "bg-slate-900 text-amber-400 border border-slate-800 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Play className="w-4 h-4 text-emerald-500 fill-emerald-500 animate-pulse" /> Interactive Mock Interview
              </button>
            </div>

            {/* Score pill if evaluations present */}
            {evaluatedCount > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Mock Interview Avg Score: {avgScore}% ({evaluatedCount}/{questionsList.length} Completed)</span>
              </div>
            )}
          </div>

          {/* TAB 1: PRACTICE QUESTIONS & IDEAL ANSWERS */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              {/* Question Category Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === "all"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    All ({questionsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("technical")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === "technical"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    Technical Questions ({questionsList.filter((q) => q.type === "technical").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("hr")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === "hr"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    HR Questions ({questionsList.filter((q) => q.type === "hr").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("behavioral")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      filterType === "behavioral"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    Behavioral Questions ({questionsList.filter((q) => q.type === "behavioral" || q.type === "situational").length})
                  </button>
                </div>

                <div className="text-xs text-slate-400 font-semibold">
                  Showing {filteredQuestions.length} of {questionsList.length} Questions
                </div>
              </div>

              {/* Questions Accordion List */}
              <div className="space-y-4">
                {filteredQuestions.map((q, index) => {
                  const isExpanded = expandedId === q.id;
                  const categoryColor =
                    q.type === "technical"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/25"
                      : q.type === "hr"
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/25";

                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl premium-card overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-950/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider shrink-0 mt-0.5 ${categoryColor}`}>
                            {q.type}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-white leading-snug">
                              Q{index + 1}. {q.question}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-medium">{q.context}</p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-6 pt-0 border-t border-slate-800/80 space-y-5 text-xs text-slate-300">
                          {/* Interviewer Objective Context */}
                          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-2.5">
                            <Target className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block mb-0.5">Interviewer Goal & Objective:</span>
                              <p className="text-slate-350 leading-relaxed font-medium">{q.context}</p>
                            </div>
                          </div>

                          {/* AI Sample Answer Box */}
                          {q.sampleAnswer && (
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5" /> AI Model Ideal Answer:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyAnswer(q.id, q.sampleAnswer!)}
                                  className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedId === q.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedId === q.id ? "Copied" : "Copy Answer"}</span>
                                </button>
                              </div>
                              <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-emerald-500/15">
                                "{q.sampleAnswer}"
                              </p>
                            </div>
                          )}

                          {/* Ideal Answer Structural Outline */}
                          <div>
                            <span className="font-bold text-white block mb-2">
                              Key Structural Outline & Answer Steps:
                            </span>
                            <ul className="space-y-2">
                              {q.idealAnswerOutline.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-slate-300 font-medium">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Must-Mention Keywords */}
                          {q.keyKeywords && q.keyKeywords.length > 0 && (
                            <div>
                              <span className="font-bold text-white block mb-1.5">
                                Essential Keywords & Concepts to Cover:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {q.keyKeywords.map((kw, idx) => (
                                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 font-bold text-[11px] border border-slate-800">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quick Launch Mock Mode for this Question */}
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const qIndex = questionsList.findIndex((item) => item.id === q.id);
                                if (qIndex >= 0) setCurrentQuestionIndex(qIndex);
                                setActiveTab("mock");
                              }}
                              className="px-4 py-2 rounded-xl bg-amber-650 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/10 hover:-translate-y-0.5 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>Practice This Question in Mock Mode</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE MOCK INTERVIEW MODE */}
          {activeTab === "mock" && currentQ && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Question Navigation & Progress Toolbar */}
              <div className="p-6 premium-card space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-350 text-xs font-bold border border-emerald-500/20 uppercase tracking-wider">
                      Question {currentQuestionIndex + 1} of {questionsList.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Type: {currentQ.type}
                    </span>
                  </div>

                  {/* Question Quick Jump Selector Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-semibold mr-1 hidden sm:inline">Jump to:</span>
                    {questionsList.map((qItem, idx) => {
                      const isEvaluated = !!evaluations[qItem.id];
                      const isCurrent = idx === currentQuestionIndex;
                      return (
                        <button
                          key={qItem.id}
                          type="button"
                          onClick={() => {
                            setCurrentQuestionIndex(idx);
                            setUserAnswer(evaluations[qItem.id]?.userAnswer || "");
                          }}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                            isCurrent
                              ? "bg-amber-600 text-white shadow-md border border-amber-500/50"
                              : isEvaluated
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-800/50 text-slate-400 hover:bg-slate-850 hover:text-white border border-slate-850"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-905 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-amber-550 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questionsList.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active Question Prompt Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 text-white border border-slate-800 shadow-xl relative overflow-hidden space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> AI Interviewer Prompt
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                      "{currentQ.question}"
                    </h2>
                  </div>

                  {/* Audio Listen Button */}
                  <button
                    type="button"
                    onClick={() => speakQuestion(currentQ.question)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer shrink-0 ${
                      isPlayingAudio
                        ? "bg-amber-500 text-slate-900 animate-pulse"
                        : "bg-slate-805 hover:bg-slate-700 text-slate-205"
                    }`}
                    title="Listen to interviewer read question"
                  >
                    {isPlayingAudio ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-xs text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-medium">
                  <strong>Interviewer Context:</strong> {currentQ.context}
                </p>
              </div>

              {/* User Answer Input & AI Feedback Box */}
              <div className="p-6 sm:p-8 premium-card space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-350">
                      Your Response / Answer:
                    </label>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Formulate your answer using the STAR method or technical steps
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type or dictate your answer to the interviewer here..."
                    className="w-full p-4 premium-input text-xs outline-none focus:bg-slate-950/80 resize-y"
                  />
                </div>

                {/* Actions & Navigation Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => {
                        const nextIdx = currentQuestionIndex - 1;
                        setCurrentQuestionIndex(nextIdx);
                        setUserAnswer(evaluations[questionsList[nextIdx].id]?.userAnswer || "");
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 hover:text-white disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <button
                      type="button"
                      disabled={currentQuestionIndex === questionsList.length - 1}
                      onClick={() => {
                        const nextIdx = currentQuestionIndex + 1;
                        setCurrentQuestionIndex(nextIdx);
                        setUserAnswer(evaluations[questionsList[nextIdx].id]?.userAnswer || "");
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-800 hover:text-white disabled:opacity-40 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={evaluating || !userAnswer || userAnswer.trim().length < 5}
                    onClick={() => handleEvaluateAnswer(currentQ)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-650 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Answer Quality...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Answer for AI Scoring & Feedback</span>
                      </>
                    )}
                  </button>
                </div>

                {/* AI Evaluation Result Card */}
                {currentEval && (
                  <div className="mt-6 p-6 premium-card space-y-4 border-amber-500/10 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-805 pb-3">
                      <div>
                        <span className="text-xs font-bold text-amber-405 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-450" /> AI Evaluation Breakdown
                        </span>
                        <p className="text-xs text-slate-300 mt-1 font-semibold leading-relaxed">{currentEval.feedbackSummary}</p>
                      </div>

                      <div className="px-4 py-2 rounded-2xl bg-slate-950/60 border border-amber-500/20 shadow-sm text-center min-w-20">
                        <span className="text-2xl font-black text-amber-400">{currentEval.score}%</span>
                        <span className="text-[9px] block text-slate-400 font-bold tracking-wider uppercase mt-0.5">Score</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Strengths */}
                      <div className="p-3.5 rounded-xl bg-slate-950/40 border border-emerald-500/20 space-y-1.5">
                        <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths in Your Answer
                        </span>
                        <ul className="space-y-1 text-slate-300 font-medium">
                          {currentEval.strengths.map((str, idx) => (
                            <li key={idx}>• {str}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Areas to improve */}
                      <div className="p-3.5 rounded-xl bg-slate-950/40 border border-rose-500/20 space-y-1.5">
                        <span className="font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Missing Concepts & Gaps
                        </span>
                        <ul className="space-y-1 text-slate-300 font-medium">
                          {currentEval.areasToImprove.map((gap, idx) => (
                            <li key={idx}>• {gap}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Improved Answer */}
                    {currentEval.improvedAnswer && (
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-amber-500/25 space-y-2">
                        <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 animate-pulse" /> Model Exemplary Answer Rewrite:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                          "{currentEval.improvedAnswer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

