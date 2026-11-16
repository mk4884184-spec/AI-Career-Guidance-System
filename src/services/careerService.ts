import { api } from "./api";
import { AssessmentData, RoadmapData, ResumeAnalysisData, InterviewPrepData, MarketInsightData, BookmarkItem } from "../types";

export const careerService = {
  async submitQuiz(data: {
    skills: string[];
    interests: string[];
    education: string;
    experienceYears: string;
    preferredLocation?: string;
    workStyle?: string;
    values?: string[];
    preferredIndustry?: string;
  }): Promise<AssessmentData> {
    const res: any = await api.post("/assessment/submit", data);
    return res.data;
  },

  async getAssessmentHistory(): Promise<AssessmentData[]> {
    const res: any = await api.get("/assessment/history");
    return res.data;
  },

  async generateRoadmap(careerTitle: string, experienceLevel: string): Promise<RoadmapData> {
    const res: any = await api.post("/roadmap/generate", { careerTitle, experienceLevel });
    return res.data;
  },

  async getUserRoadmaps(): Promise<RoadmapData[]> {
    const res: any = await api.get("/roadmap/user");
    return res.data;
  },

  async toggleRoadmapPhase(roadmapId: string, phaseNumber: number): Promise<RoadmapData> {
    const res: any = await api.patch(`/roadmap/${roadmapId}/phase`, { phaseNumber });
    return res.data;
  },

  async analyzeResume(resumeText: string, targetRole: string, pdfBase64?: string, fileName?: string): Promise<ResumeAnalysisData> {
    const res: any = await api.post("/resume/analyze", { resumeText, targetRole, pdfBase64, fileName });
    return res.data;
  },

  async getResumeHistory(): Promise<ResumeAnalysisData[]> {
    const res: any = await api.get("/resume/history");
    return res.data;
  },

  async generateInterviewPrep(targetRole: string, experienceLevel: string): Promise<InterviewPrepData> {
    const res: any = await api.post("/interview/generate", { targetRole, experienceLevel });
    return res.data;
  },

  async evaluateInterviewAnswer(questionText: string, userAnswer: string, questionType: string, sampleAnswer?: string): Promise<any> {
    const res: any = await api.post("/interview/evaluate", { questionText, userAnswer, questionType, sampleAnswer });
    return res.data;
  },

  async getMarketInsights(role: string): Promise<MarketInsightData> {
    const res: any = await api.get(`/career/market-insights?role=${encodeURIComponent(role)}`);
    return res.data;
  },

  async bookmarkItem(itemType: "career" | "roadmap" | "resource", title: string, data: any): Promise<BookmarkItem> {
    const res: any = await api.post("/career/bookmarks", { itemType, title, data });
    return res.data;
  },

  async getBookmarks(): Promise<BookmarkItem[]> {
    const res: any = await api.get("/career/bookmarks");
    return res.data;
  },

  async removeBookmark(id: string): Promise<void> {
    await api.delete(`/career/bookmarks/${id}`);
  },

  async counselorChat(message: string, chatHistory: any[]): Promise<any> {
    const res: any = await api.post("/ai/chatbot", { message, chatHistory });
    return res.data;
  },

  async getChatHistory(): Promise<any[]> {
    const res: any = await api.get("/ai/chatbot/history");
    return res.data?.messages || [];
  },

  async compareCareers(careerA: string, careerB: string): Promise<any> {
    const res: any = await api.post("/ai/compare", { careerA, careerB });
    return res.data;
  },

  async getProjectRecommendations(targetCareer: string): Promise<any> {
    const res: any = await api.post("/ai/projects", { targetCareer });
    return res.data?.projects || [];
  },

  async getInternshipRecommendations(targetCareer: string): Promise<any> {
    const res: any = await api.post("/ai/internships", { targetCareer });
    return res.data || {};
  },

  async getAnnouncements(): Promise<any[]> {
    const res: any = await api.get("/announcements");
    return Array.isArray(res.data) ? res.data : res.data?.announcements || [];
  },

  async createAnnouncement(title: string, content: string): Promise<any> {
    const res: any = await api.post("/admin/announcements", { title, content });
    return res.data;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await api.delete(`/admin/announcements/${id}`);
  },
};
