import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IRoadmapDoc } from "../config/db.js";
import { generateRoadmap } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const createRoadmap = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId || "guest";
  const { careerTitle, experienceLevel } = req.body;

  if (!careerTitle) {
    return sendError(res, "Career title is required to generate a roadmap", 400);
  }

  try {
    const rawData = await generateRoadmap(careerTitle, experienceLevel || "Beginner");

    const roadmapDoc: IRoadmapDoc = {
      id: `roadmap-${Date.now()}`,
      userId,
      careerTitle: rawData.careerTitle || careerTitle,
      overallTimeline: rawData.overallTimeline || "6 Months",
      phases: (rawData.phases || []).map((p: any) => ({
        ...p,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
    };

    dbStore.roadmaps.set(roadmapDoc.id, roadmapDoc);

    return sendSuccess(res, roadmapDoc, "Career roadmap generated successfully", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to generate career roadmap", 500);
  }
};

export const getUserRoadmaps = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const roadmaps: IRoadmapDoc[] = [];
  for (const item of dbStore.roadmaps.values()) {
    if (item.userId === userId) {
      roadmaps.push(item);
    }
  }

  roadmaps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return sendSuccess(res, roadmaps);
};

export const togglePhaseCompletion = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { phaseNumber } = req.body;

  const roadmap = dbStore.roadmaps.get(id);
  if (!roadmap) return sendError(res, "Roadmap not found", 404);

  const phase = roadmap.phases.find((p) => p.phaseNumber === Number(phaseNumber));
  if (!phase) return sendError(res, "Phase not found in this roadmap", 404);

  phase.completed = !phase.completed;
  dbStore.roadmaps.set(roadmap.id, roadmap);

  return sendSuccess(res, roadmap, "Phase completion status updated");
};
