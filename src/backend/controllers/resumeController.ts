import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IResumeDoc } from "../config/db.js";
import { analyzeResumeContent } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { validateResumeInput } from "../validators/careerValidator.js";
import { PDFParse } from "pdf-parse";

export const analyzeResume = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId || "user-demo-123";
  let { resumeText, targetRole, pdfBase64, fileName } = req.body;

  const errors = validateResumeInput(req.body);
  if (errors.length > 0) {
    return sendError(res, errors.join("; "), 400);
  }

  try {
    let extractedText = "";
    if (pdfBase64) {
      try {
        const cleanBase64 = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;
        const buffer = Buffer.from(cleanBase64, "base64");
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        extractedText = result.text || "";
        await parser.destroy();

        if (!extractedText.trim()) {
          return sendError(res, "We couldn't extract readable text from this PDF. Please ensure it is a text-based PDF resume.", 400);
        }
      } catch (err: any) {
        console.error("PDF Extraction Error:", err);
        return sendError(res, "Unable to extract readable text from this PDF. Please upload a text-based PDF resume.", 400);
      }
      resumeText = extractedText;
    }

    console.log(`[ATS Audit] Backend request received.`);
    console.log(`[ATS Audit] Target Job Role: "${targetRole || 'Software Engineer'}"`);
    if (pdfBase64) {
      console.log(`[ATS Audit] Uploaded Filename: "${fileName || 'Unnamed PDF'}"`);
      console.log(`[ATS Audit] Extracted Text Length: ${resumeText.length} characters`);
      console.log(`[ATS Audit] First 120 characters of extracted text: "${resumeText.substring(0, 120).replace(/\s+/g, ' ')}..."`);
    } else {
      console.log(`[ATS Audit] Direct Text Input Length: ${resumeText.length} characters`);
      console.log(`[ATS Audit] First 120 characters of input text: "${resumeText.substring(0, 120).replace(/\s+/g, ' ')}..."`);
    }

    console.log(`[ATS Audit] Gemini/ATS analysis request generated.`);
    const analysis = await analyzeResumeContent(
      resumeText,
      targetRole || "Software Engineer",
      pdfBase64
    );
    console.log(`[ATS Audit] Analysis response received.`);

    const resumeDoc: IResumeDoc = {
      id: `resume-${Date.now()}`,
      userId,
      targetRole: targetRole || "Software Engineer",
      resumeText: resumeText || "",
      fileName,
      candidateName: analysis.candidateName || "Not detected",
      overallScore: analysis.overallScore || 82,
      atsScore: analysis.atsScore || 78,
      missingKeywords: analysis.missingKeywords || [],
      grammarErrors: analysis.grammarErrors || [],
      formatting: analysis.formatting || {
        rating: "Good",
        layoutScore: 80,
        feedback: ["Clean layout"],
      },
      resumeStrength: analysis.resumeStrength || [],
      weaknesses: analysis.weaknesses || [],
      suggestions: analysis.suggestions || [],
      strengths: analysis.strengths || analysis.resumeStrength || [],
      criticalGaps: analysis.criticalGaps || analysis.weaknesses || [],
      formattingAdvice: analysis.formattingAdvice || [],
      keywordOptimization: analysis.keywordOptimization || analysis.missingKeywords || [],
      lineByLineSuggestions: analysis.lineByLineSuggestions || analysis.suggestions || [],
      createdAt: new Date().toISOString(),
    };

    dbStore.resumes.set(resumeDoc.id, resumeDoc);

    return sendSuccess(res, resumeDoc, "Resume analysis generated successfully", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to analyze resume", 500);
  }
};

export const getResumeHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId || "user-demo-123";

  const history: IResumeDoc[] = [];
  for (const item of dbStore.resumes.values()) {
    if (item.userId === userId || item.userId === "user-demo-123") {
      history.push(item);
    }
  }

  history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sendSuccess(res, history);
};
