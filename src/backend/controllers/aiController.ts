import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IChatHistoryDoc, IActivityLogDoc } from "../config/db.js";
import { getChatbotResponse, compareCareers, getProjectRecommendations, getInternshipRecommendations } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Helper to log user activities
const logActivity = (userId: string | undefined, userName: string, userEmail: string, action: string) => {
  const log: IActivityLogDoc = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    userId,
    userName,
    userEmail,
    action,
    timestamp: new Date().toISOString()
  };
  dbStore.activityLogs.set(log.id, log);
  dbStore.save();
};

export const chatbot = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const { message } = req.body;
  if (!message) return sendError(res, "Message is required", 400);

  try {
    const user = dbStore.users.get(userId);
    const userName = user?.name || "Student";
    const userEmail = user?.email || "student@example.com";

    const profileContext = user ? {
      name: user.name,
      targetRole: user.targetRole || "Not specified",
      skills: user.skills || [],
      experienceLevel: user.experienceLevel || "Not specified",
      education: user.education || "Not specified",
      interests: user.interests || [],
      preferredLocation: user.preferredLocation || "Not specified",
      preferredIndustry: user.preferredIndustry || "Not specified"
    } : undefined;

    // Find or create chat history for this user
    let chatDoc: IChatHistoryDoc | null = null;
    for (const doc of dbStore.chatHistory.values()) {
      if (doc.userId === userId) {
        chatDoc = doc;
        break;
      }
    }

    if (!chatDoc) {
      chatDoc = {
        id: `chat-${Date.now()}`,
        userId,
        messages: [],
        updatedAt: new Date().toISOString()
      };
    }

    // Call Gemini
    const answer = await getChatbotResponse(message, chatDoc.messages, profileContext);

    // Save history
    chatDoc.messages.push({ sender: "user", text: message, timestamp: new Date().toISOString() });
    chatDoc.messages.push({ sender: "bot", text: answer, timestamp: new Date().toISOString() });
    chatDoc.updatedAt = new Date().toISOString();

    dbStore.chatHistory.set(chatDoc.id, chatDoc);
    dbStore.save();

    logActivity(userId, userName, userEmail, "Interacted with AI Career Counselor");

    return sendSuccess(res, { answer, reply: answer, history: chatDoc.messages });
  } catch (error: any) {
    return sendError(res, error.message || "Failed to get chatbot response", 500);
  }
};

export const getChatHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  try {
    let chatDoc: IChatHistoryDoc | null = null;
    for (const doc of dbStore.chatHistory.values()) {
      if (doc.userId === userId) {
        chatDoc = doc;
        break;
      }
    }

    return sendSuccess(res, { messages: chatDoc ? chatDoc.messages : [] });
  } catch (error: any) {
    return sendError(res, error.message || "Failed to fetch chat history", 500);
  }
};

export const compare = async (req: AuthenticatedRequest, res: Response) => {
  const { careerA, careerB } = req.body;
  if (!careerA || !careerB) {
    return sendError(res, "Two careers are required for comparison", 400);
  }

  try {
    const comparison = await compareCareers(careerA, careerB);
    
    // Format response to match project 1 structure
    const c = comparison.comparison || {};
    const responseData = {
      careerA: comparison.careerA || careerA,
      careerB: comparison.careerB || careerB,
      salaryComparison: c.salary ? `Salary range for ${careerA} is ${c.salary.a || 'N/A'}, and for ${careerB} is ${c.salary.b || 'N/A'}. (Advantage: ${c.salary.winner || 'Equivalent'})` : "N/A",
      growthComparison: c.growth ? `Market growth rate for ${careerA} is ${c.growth.a || 'N/A'}, and for ${careerB} is ${c.growth.b || 'N/A'}. (Advantage: ${c.growth.winner || 'Equivalent'})` : "N/A",
      skillsComparison: c.skills ? `Core skills for ${careerA}: ${(Array.isArray(c.skills.a) ? c.skills.a : []).join(", ")}. Core skills for ${careerB}: ${(Array.isArray(c.skills.b) ? c.skills.b : []).join(", ")}.` : "N/A",
      certificationsComparison: c.companies ? `Key employers hiring for ${careerA}: ${(Array.isArray(c.companies.a) ? c.companies.a : []).join(", ")}. Key employers hiring for ${careerB}: ${(Array.isArray(c.companies.b) ? c.companies.b : []).join(", ")}.` : "N/A",
      difficultyComparison: c.difficulty ? `Difficulty level for ${careerA} is typically ${c.difficulty.a || 'Moderate'}. For ${careerB} it is ${c.difficulty.b || 'Moderate'}. ${c.difficulty.explanation || ''}` : "N/A",
      verdict: comparison.summaryRecommendation || "N/A"
    };

    return sendSuccess(res, responseData);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to compare careers", 500);
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const { targetCareer } = req.body;
  if (!targetCareer) return sendError(res, "Target career is required", 400);

  try {
    const user = dbStore.users.get(userId);
    const skills = user?.skills || [];
    
    const projects = await getProjectRecommendations(targetCareer, skills);
    return sendSuccess(res, { projects });
  } catch (error: any) {
    return sendError(res, error.message || "Failed to get project recommendations", 500);
  }
};

export const getInternships = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const { targetCareer } = req.body;
  if (!targetCareer) return sendError(res, "Target career is required", 400);

  try {
    const user = dbStore.users.get(userId);
    const skills = user?.skills || [];
    
    const internshipData = await getInternshipRecommendations(targetCareer, skills);
    return sendSuccess(res, internshipData);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to get internship recommendations", 500);
  }
};
