import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { generateCourseRecommendations } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getCourseRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  const { careerGoal, missingSkills } = req.body;

  try {
    const formattedSkills = Array.isArray(missingSkills)
      ? missingSkills
      : typeof missingSkills === "string"
      ? missingSkills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const recommendations = await generateCourseRecommendations(
      careerGoal || "Full Stack Software Engineer",
      formattedSkills
    );

    return sendSuccess(res, recommendations, "Course recommendations generated successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to generate course recommendations", 500);
  }
};
