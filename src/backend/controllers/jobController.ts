import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { generateJobRecommendations } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getJobRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  const { skills, education, experience, location } = req.body;

  try {
    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const recommendations = await generateJobRecommendations(
      formattedSkills,
      education || "Bachelor's Degree",
      experience || "2-4 years",
      location || "Remote / Major Tech Hubs"
    );

    return sendSuccess(res, recommendations, "Job recommendations generated successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to generate job recommendations", 500);
  }
};
