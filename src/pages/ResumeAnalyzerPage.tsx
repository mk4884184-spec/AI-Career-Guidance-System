import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Download,
  UploadCloud,
  X,
  FileCheck,
  RefreshCw,
  AlertCircle,
  Layout,
  Tag,
  Check,
  Info
} from "lucide-react";
import { careerService } from "../services/careerService";
import { useCareer } from "../hooks/useCareer";
import { ScoreGauge } from "../components/ScoreGauge";
import { ResumeAnalysisData } from "../types";
import { generateResumePdfReport } from "../utils/pdfGenerator";
import toast from "react-hot-toast";
import { notificationService } from "../services/notificationService";

const SAMPLE_RESUME = `JOHN DOE
Senior Full Stack Developer | San Francisco, CA | john@example.com | (555) 019-2831

PROFESSIONAL SUMMARY:
Experienced Software Developer with 4+ years of building responsive web applications using JavaScript, TypeScript, React, HTML, CSS, and Express. Focused on delivering clean UI components and reliable backend REST endpoints.

WORK EXPERIENCE:
Frontend Web Developer | Tech Solutions Inc. | 2022 - Present
- Developed frontend components using React, Redux, and Tailwind CSS.
- Worked with backend team to integrate REST API endpoints in Express.
- Fixed UI accessibility bugs and improved page load performance.
- Assisted with database queries, code reviews, and unit testing.

Software Development Intern | Web Dynamics | 2021 - 2022
- Built responsive web pages and interactive forms for client applications.
- Participated in weekly agile sprint retrospectives and code reviews.

EDUCATION:
B.S. Computer Science | State University | Graduated 2021`;

export const ResumeAnalyzerPage: React.FC = () => {
  const { setLatestResume } = useCareer();
  const [targetRole, setTargetRole] = useState<string>("Senior Full Stack Engineer");
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUME);
  const [inputMode, setInputMode] = useState<"file" | "text">("file");

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".txt")) {
      toast.error("Please upload a .pdf or .txt resume file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    // Clear previous results
    setAnalysis(null);
    setLatestResume(null);

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (file.name.toLowerCase().endsWith(".pdf")) {
        setPdfBase64(result);
        setResumeText("");
      } else {
        setResumeText(result);
        setPdfBase64(null);
      }
      toast.success(`Loaded "${file.name}" ready for analysis!`);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && !file.name.toLowerCase().endsWith(".txt")) {
      toast.error("Please upload a .pdf or .txt resume file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    // Clear previous results
    setAnalysis(null);
    setLatestResume(null);

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (file.name.toLowerCase().endsWith(".pdf")) {
        setPdfBase64(result);
        setResumeText("");
      } else {
        setResumeText(result);
        setPdfBase64(null);
      }
      toast.success(`Uploaded file "${file.name}"`);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPdfBase64(null);
    setResumeText("");
    setAnalysis(null);
    setLatestResume(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfBase64 && resumeText.trim().length < 20) {
      toast.error("Please upload a PDF or enter resume text before analyzing.");
      return;
    }

    setLoading(true);
    try {
      const data = await careerService.analyzeResume(
        inputMode === "text" ? resumeText : "",
        targetRole,
        pdfBase64 || undefined,
        uploadedFile?.name
      );
      setLatestResume(data);
      setAnalysis(data);
      notificationService.notifyResumeAnalyzed(
        data.atsScore || 85,
        `ATS Scan Complete for ${targetRole || "Software Engineer"}. Strengths and skill gaps generated!`
      );
    } catch (err: any) {
      console.error("Resume analysis error", err);
      toast.error(err.message || "Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdfReport = () => {
    if (!analysis) return;
    try {
      generateResumePdfReport(analysis);
      toast.success("PDF analysis report downloaded!");
    } catch (err) {
      console.error("PDF generation error", err);
      toast.error("Could not download PDF report.");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/25 mb-2">
          <FileText className="w-3.5 h-3.5 text-emerald-400" /> AI Resume & ATS Audit Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Resume ATS Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload your PDF resume or paste raw text to receive an immediate ATS score, missing keyword matrix, grammar fixes, formatting evaluation, and high-impact bullet point rewrites.
        </p>
      </div>

      {/* Input Mode Switcher & Form */}
      <form onSubmit={handleAnalyze} className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
            Target Job Title / Role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer, Full Stack Developer, Product Manager..."
            className="w-full premium-input px-4 py-3 text-xs outline-none transition-all text-white placeholder:text-slate-500"
            required
          />
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3.5">
          <button
            type="button"
            onClick={() => {
              setInputMode("file");
              setAnalysis(null);
              setLatestResume(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              inputMode === "file"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" /> Upload PDF Resume
          </button>
          <button
            type="button"
            onClick={() => {
              setInputMode("text");
              setAnalysis(null);
              setLatestResume(null);
              setResumeText(SAMPLE_RESUME);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              inputMode === "text"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Paste Resume Text
          </button>
        </div>

        {/* PDF Upload Mode */}
        {inputMode === "file" ? (
          <div>
            {!uploadedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-white/[0.12] hover:border-emerald-500/60 rounded-2xl p-8 text-center bg-black/30 hover:bg-black/40 transition-all cursor-pointer group"
              >
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-500/25 shadow-sm shadow-emerald-500/10">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white">
                      Drag & Drop your PDF Resume here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                      Supports PDF files (up to 10MB) or Plain Text documents
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-slate-200 shadow-sm transition-colors mt-1 inline-block">
                    Browse Files
                  </span>
                </label>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{uploadedFile.name}</h4>
                    <p className="text-[11px] text-emerald-400 font-semibold">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • PDF Document Ready
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Text Input Mode */
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300">
                Resume Text Content
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setResumeText(SAMPLE_RESUME)}
                  className="text-[11px] text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Load Sample
                </button>
                <button
                  type="button"
                  onClick={() => setResumeText("")}
                  className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
            <textarea
              rows={9}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain resume text, experience bullets, and skill stack..."
              className="w-full p-4 premium-input text-xs font-mono outline-none resize-y text-white placeholder:text-slate-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!pdfBase64 && resumeText.trim().length < 20)}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing resume keywords & ATS rules with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume & Generate ATS Audit Report</span>
            </>
          )}
        </button>
      </form>

      {/* Output Analysis Section */}
      {analysis && (
        <div className="space-y-6 pt-4 border-t border-white/[0.06] animate-in fade-in duration-300">
          {/* Top Banner with Circular Gauges & PDF Download Button */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto justify-around md:justify-start">
              {/* ATS Circular Chart Gauge */}
              <ScoreGauge
                score={analysis.atsScore}
                label="ATS Compliance Score"
                size={140}
                subtitle="Keyword Density & Parsing"
              />

              <div className="hidden sm:block w-px h-24 bg-white/[0.08]" />

              {/* Overall Quality Score */}
              <ScoreGauge
                score={analysis.overallScore}
                label="Overall Resume Quality"
                size={140}
                subtitle="Impact & Presentation"
              />
            </div>

            {/* Download PDF Button */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-end justify-center border-t md:border-t-0 pt-4 md:pt-0 border-white/[0.06]">
              <button
                type="button"
                onClick={handleDownloadPdfReport}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl btn-glow-primary text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Download Analysis Report PDF</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-2.5 text-center md:text-right font-medium">
                Includes full audit, missing keywords & bullet rewrites
              </p>
            </div>
          </div>

          {/* Missing Keywords & Grammar Errors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-amber-400" /> Missing ATS Keywords
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 font-medium leading-relaxed">
                Integrate these high-frequency job keywords to pass automated resume screeners:
              </p>
              <div className="flex flex-wrap gap-2">
                {(analysis.missingKeywords || analysis.keywordOptimization || []).map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3 h-3 text-amber-400" /> {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Grammar & Writing Style Errors */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-rose-400" /> Grammar & Style Corrections
              </h3>
              <div className="space-y-3">
                {analysis.grammarErrors && analysis.grammarErrors.length > 0 ? (
                  analysis.grammarErrors.map((err, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1.5">
                      <div className="font-bold text-rose-300">{err.issue}</div>
                      <div className="text-slate-300 font-medium">
                        <span className="font-bold text-emerald-400">Fix: </span>
                        {err.correction}
                      </div>
                      {err.context && (
                        <div className="text-[10px] text-slate-400 italic">"{err.context}"</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic font-medium">No significant grammar errors found!</p>
                )}
              </div>
            </div>
          </div>

          {/* Formatting & Strengths/Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formatting Analysis */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl">
              <h3 className="text-sm font-extrabold text-white flex items-center justify-between mb-3">
                <span className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-400" /> Formatting & Layout Evaluation
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/30 uppercase tracking-wider">
                  {analysis.formatting?.rating || "Optimal"}
                </span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium mt-4">
                {(analysis.formatting?.feedback || analysis.formattingAdvice || []).map((fb, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span className="leading-snug">{fb}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resume Strengths & Weaknesses */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-xl space-y-4">
              <div>
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Resume Strengths
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                  {(analysis.resumeStrength || analysis.strengths || []).map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3.5 border-t border-white/[0.06]">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Critical Resume Weaknesses
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                  {(analysis.weaknesses || analysis.criticalGaps || []).map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AI Suggestions / Bullet Rewrites */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0c102a]/85 via-[#090d22]/95 to-[#060816]/95 border border-white/[0.08] shadow-2xl">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-4">
              <RefreshCw className="w-4 h-4 text-emerald-400" /> AI High-Impact Bullet Point Rewrites
            </h3>
            <div className="space-y-4">
              {(analysis.suggestions || analysis.lineByLineSuggestions || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider block">Original Bullet:</span>
                    <p className="text-slate-400 line-through mt-0.5">{item.original}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">High-Impact AI Rewrite:</span>
                    <p className="text-white font-bold mt-0.5">{item.suggested}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 italic pt-2 border-t border-white/[0.06] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>ATS Impact:</strong> {item.reason}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
