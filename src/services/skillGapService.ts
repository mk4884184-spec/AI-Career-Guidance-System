import { api } from "./api";
import { SkillGapData } from "../types";

export const skillGapService = {
  async analyzeGap(data: {
    targetRole: string;
    currentSkills: string[];
    requiredSkills?: string[];
  }): Promise<SkillGapData> {
    const res: any = await api.post("/skill-gap/analyze", data);
    return res.data;
  },

  async getHistory(): Promise<SkillGapData[]> {
    const res: any = await api.get("/skill-gap/history");
    return res;
  },

  async getById(id: string): Promise<SkillGapData> {
    const res: any = await api.get(`/skill-gap/${id}`);
    return res;
  },
};
