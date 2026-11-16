import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IInterviewDoc } from "../config/db.js";
import { generateInterviewQuestions, evaluateInterviewAnswer } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createInterviewPrep = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId || "user-demo-123";
  const { targetRole, experienceLevel } = req.body;

  if (!targetRole) {
    return sendError(res, "Target job role is required", 400);
  }

  try {
    const data = await generateInterviewQuestions(targetRole, experienceLevel || "Mid Level");

    const interviewDoc: IInterviewDoc = {
      id: `interview-${Date.now()}`,
      userId,
      targetRole: data.targetRole || targetRole,
      experienceLevel: data.experienceLevel || experienceLevel || "Mid Level",
      questions: data.questions || [],
      createdAt: new Date().toISOString(),
    };

    dbStore.interviews.set(interviewDoc.id, interviewDoc);

    return sendSuccess(res, interviewDoc, "Interview prep session generated successfully", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to generate interview prep session", 500);
  }
};

export const evaluateAnswer = async (req: AuthenticatedRequest, res: Response) => {
  const { questionText, userAnswer, questionType, sampleAnswer } = req.body;

  if (!questionText || !userAnswer || userAnswer.trim().length < 5) {
    return sendError(res, "Question text and valid user answer (at least 5 characters) are required", 400);
  }

  try {
    const evaluation = await evaluateInterviewAnswer(
      questionText,
      userAnswer,
      questionType || "technical",
      sampleAnswer
    );
    return sendSuccess(res, evaluation, "Answer evaluated successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to evaluate answer", 500);
  }
};

export const getInterviewHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId || "user-demo-123";

  const history: IInterviewDoc[] = [];
  for (const item of dbStore.interviews.values()) {
    if (item.userId === userId || item.userId === "user-demo-123") {
      history.push(item);
    }
  }

  history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sendSuccess(res, history);
};
