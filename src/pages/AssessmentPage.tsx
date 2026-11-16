import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Compass, Sparkles, Plus, X, ArrowRight, Loader2, CheckCircle2, MapPin, History, Calendar } from "lucide-react";
import { careerService } from "../services/careerService";
import { notificationService } from "../services/notificationService";
import { useCareer } from "../hooks/useCareer";
import { CareerCard } from "../components/CareerCard";
import { CareerRecommendation, AssessmentData } from "../types";

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLatestAssessment, setActiveRoadmap } = useCareer();

  const [skills, setSkills] = useState<string[]>(["JavaScript", "React", "HTML/CSS", "Python", "SQL"]);
  const [skillInput, setSkillInput] = useState<string>("");

  const [interests, setInterests] = useState<string[]>(["Web Development", "Artificial Intelligence", "Cloud Architecture"]);
  const [interestInput, setInterestInput] = useState<string>("");

  const [education, setEducation] = useState<string>("Bachelor's Degree");
  const [experienceYears, setExperienceYears] = useState<string>("1-3 years");
  const [preferredLocation, setPreferredLocation] = useState<string>("San Francisco, CA / Remote");
  const [workStyle, setWorkStyle] = useState<string>("Hybrid / Remote");
  const [preferredIndustry, setPreferredIndustry] = useState<string>("Technology & Software");

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CareerRecommendation[] | null>(null);

  const [history, setHistory] = useState<AssessmentData[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    loadAssessmentHistory();
  }, []);

  const loadAssessmentHistory = async () => {
    try {
      const data = await careerService.getAssessmentHistory();
      setHistory(data || []);
      if (data && data.length > 0 && !results) {
        setResults(data[0].recommendations);
      }
    } catch (err) {
      console.error("Failed to fetch assessment history", err);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await careerService.submitQuiz({
        skills,
        interests,
        education,
        experienceYears,
        preferredLocation,
        workStyle,
        values: ["High Impact", "Work-Life Balance", "Continuous Learning"],
        preferredIndustry,
      });
      setLatestAssessment(data);
      setResults(data.recommendations);
      loadAssessmentHistory();
      notificationService.notifyAIRecommendationReady(
        `Gemini AI found ${data.recommendations?.length || 3} top matched roles based on your preferences!`
      );
    } catch (err) {
      console.error("Assessment submission error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async (title: string) => {
    try {
      const roadmap = await careerService.generateRoadmap(title, experienceYears);
      setActiveRoadmap(roadmap);
      navigate("/roadmap");
    } catch (err) {
      console.error("Failed to generate roadmap", err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Compass className="w-3.5 h-3.5" /> AI Career Recommendation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Career Recommendation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gemini AI analyzes your skills, interests, education, experience, and location to deliver top career path recommendations.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 border border-slate-800 transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-indigo-400" />
            <span>Saved History ({history.length})</span>
          </button>
        )}
      </div>

      {/* History Drawer / Modal Section */}
      {showHistory && history.length > 0 && (
        <div className="p-5 premium-card border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-405" />
              MongoDB Recommendation History
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-500 hover:text-slate-350 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                onClick={() => {
                  setResults(item.recommendations);
                  setShowHistory(false);
                }}
                className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:border-indigo-500/30 cursor-pointer transition-all text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-450 mb-1">
                  <span className="font-bold text-indigo-400 font-semibold">Run #{history.length - index}</span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-bold text-white truncate">
                  {item.recommendations?.[0]?.title || "Career Assessment"}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate font-semibold">
                  Location: {item.quizData?.preferredLocation || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 premium-card space-y-6">
        {/* Skills Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-350 mb-2">
            Skills (Technical & Core Capabilities)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. TypeScript, React, Docker, SQL..."
              className="flex-1 px-4 py-2.5 premium-input text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-505/10 text-indigo-305 text-xs font-bold border border-indigo-500/20"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Interests & Passions */}
        <div>
          <label className="block text-xs font-bold text-slate-350 mb-2">
            Interests & Industry Passions
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              placeholder="e.g. AI Product Development, Cybersecurity, Full Stack..."
              className="flex-1 px-4 py-2.5 premium-input text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-750 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-bold border border-violet-500/20"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Form Select Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-355 mb-1.5">
              Education Level
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <option value="High School / Self-Taught">High School / Self-Taught</option>
              <option value="Associate Degree / Bootcamp">Associate Degree / Bootcamp</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree / PhD">Master's Degree / PhD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5">
              Experience Level
            </label>
            <select
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <option value="0-1 years (Entry Level)">0-1 years (Entry Level)</option>
              <option value="1-3 years (Junior - Mid)">1-3 years (Junior - Mid)</option>
              <option value="3-5 years (Mid - Senior)">3-5 years (Mid - Senior)</option>
              <option value="5+ years (Senior / Staff)">5+ years (Senior / Staff)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Preferred Location
            </label>
            <input
              type="text"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA / Remote"
              className="w-full premium-input px-4 py-2.5 text-xs outline-none focus:bg-slate-950/80 transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5">
              Preferred Work Environment
            </label>
            <select
              value={workStyle}
              onChange={(e) => setWorkStyle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <option value="Hybrid / Remote">Hybrid / Remote</option>
              <option value="100% Fully Remote">100% Fully Remote</option>
              <option value="On-Site Collaborative Office">On-Site Collaborative Office</option>
              <option value="Startup Fast-Paced">Startup Fast-Paced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-350 mb-1.5">
              Preferred Target Industry
            </label>
            <select
              value={preferredIndustry}
              onChange={(e) => setPreferredIndustry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-850 bg-slate-900/50 text-xs text-white outline-none cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <option value="Technology & Software">Technology & Software</option>
              <option value="Fintech & Banking">Fintech & Banking</option>
              <option value="Healthcare Tech">Healthcare Tech</option>
              <option value="E-Commerce & Digital Media">E-Commerce & Digital Media</option>
            </select>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-650 to-violet-650 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/15 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing profile with Gemini 3.6 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Get AI Career Recommendations</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </>
          )}
        </button>
      </form>

      {/* Generated Results Section */}
      {results && (
        <div className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-450 animate-pulse" />
              <h2 className="text-xl font-bold text-white">
                Top AI Career Recommendations
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              Saved automatically to MongoDB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((career) => (
              <CareerCard
                key={career.id || career.title}
                career={career}
                onGenerateRoadmap={handleGenerateRoadmap}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
