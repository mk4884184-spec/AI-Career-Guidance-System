import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IAssessmentDoc } from "../config/db.js";
import { generateCareerRecommendations } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { validateQuizInput } from "../validators/careerValidator.js";

export const submitAssessment = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId || "guest";
  const quizData = req.body;

  const errors = validateQuizInput(quizData);
  if (errors.length > 0) {
    return sendError(res, errors.join("; "), 400);
  }

  try {
    const recommendations = await generateCareerRecommendations(quizData);

    const assessmentDoc: IAssessmentDoc = {
      id: `assessment-${Date.now()}`,
      userId,
      quizData: {
        skills: quizData.skills || [],
        interests: quizData.interests || [],
        education: quizData.education || "Bachelor's",
        experienceYears: quizData.experienceYears || "0-2 years",
        preferredLocation: quizData.preferredLocation || "San Francisco / Remote",
        workStyle: quizData.workStyle || "Hybrid",
        values: quizData.values || [],
        preferredIndustry: quizData.preferredIndustry || "Technology",
      },
      recommendations,
      createdAt: new Date().toISOString(),
    };

    dbStore.assessments.set(assessmentDoc.id, assessmentDoc);

    // Also update user's profile skills if logged in
    if (userId !== "guest" && dbStore.users.has(userId)) {
      const user = dbStore.users.get(userId)!;
      if (quizData.skills && quizData.skills.length > 0) {
        user.skills = Array.from(new Set([...user.skills, ...quizData.skills]));
      }
      dbStore.users.set(userId, user);
    }

    return sendSuccess(res, assessmentDoc, "Career assessment generated successfully", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to process career assessment", 500);
  }
};

export const getAssessmentHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const userAssessments: IAssessmentDoc[] = [];
  for (const item of dbStore.assessments.values()) {
    if (item.userId === userId) {
      userAssessments.push(item);
    }
  }

  userAssessments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sendSuccess(res, userAssessments);
};

export const getAssessmentById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const assessment = dbStore.assessments.get(id);

  if (!assessment) {
    return sendError(res, "Assessment record not found", 404);
  }

  return sendSuccess(res, assessment);
};
