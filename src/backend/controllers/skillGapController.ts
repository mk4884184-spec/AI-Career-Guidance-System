import { Request, Response } from "express";
import { dbStore, ISkillGapDoc } from "../config/db.js";
import { analyzeSkillGap } from "../services/geminiService.js";

export const analyzeGap = async (req: Request, res: Response) => {
  try {
    const { targetRole, currentSkills, requiredSkills } = req.body;
    const userId = (req as any).user?.id || "user-demo-123";

    if (!targetRole) {
      res.status(400).json({ error: "Target role is required" });
      return;
    }

    const currentSkillsList: string[] = Array.isArray(currentSkills) ? currentSkills : [];
    const requiredSkillsList: string[] = Array.isArray(requiredSkills) ? requiredSkills : [];

    const result = await analyzeSkillGap(targetRole, currentSkillsList, requiredSkillsList);

    const doc: ISkillGapDoc = {
      id: "sg-" + Date.now(),
      userId,
      targetRole: result.targetRole || targetRole,
      currentSkills: currentSkillsList,
      requiredSkills: result.requiredSkills || requiredSkillsList,
      overallReadiness: result.overallReadiness || 0,
      totalRequiredCount: result.totalRequiredCount || (result.requiredSkills ? result.requiredSkills.length : 0),
      matchedCount: result.matchedCount || 0,
      missingCount: result.missingCount || 0,
      matchedSkills: result.matchedSkills || [],
      missingSkillsDetails: result.missingSkillsDetails || [],
      categoryBreakdown: result.categoryBreakdown || [],
      actionableSummary: result.actionableSummary || "Continue mastering missing core skills to boost job readiness.",
      createdAt: new Date().toISOString(),
    };

    // Save to MongoDB / DB store
    dbStore.skillGaps.set(doc.id, doc);

    res.status(201).json({
      message: "Skill gap analysis generated and stored successfully.",
      data: doc,
    });
  } catch (error) {
    console.error("Skill Gap Analysis Controller Error:", error);
    res.status(500).json({ error: "Failed to perform skill gap analysis" });
  }
};

export const getSkillGapHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || "user-demo-123";
    const history = Array.from(dbStore.skillGaps.values())
      .filter((sg) => sg.userId === userId || sg.userId === "user-demo-123")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(history);
  } catch (error) {
    console.error("Fetch Skill Gap History Error:", error);
    res.status(500).json({ error: "Failed to fetch skill gap history" });
  }
};

export const getSkillGapById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = dbStore.skillGaps.get(id);

    if (!doc) {
      res.status(404).json({ error: "Skill gap report not found" });
      return;
    }

    res.json(doc);
  } catch (error) {
    console.error("Fetch Skill Gap By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch skill gap report" });
  }
};
