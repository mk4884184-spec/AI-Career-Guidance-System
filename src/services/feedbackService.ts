import { api } from "./api";
import { FeedbackInput, FeedbackItem } from "../types";

export const feedbackService = {
  async submitFeedback(data: FeedbackInput): Promise<FeedbackItem> {
    const response: any = await api.post("/feedback", data);
    return response.data;
  },

  async getAllFeedback(): Promise<{
    feedbacks: FeedbackItem[];
    stats: {
      totalCount: number;
      averageRating: number;
      fiveStarCount: number;
    };
  }> {
    const response: any = await api.get("/feedback");
    return response.data;
  },

  async deleteFeedback(id: string): Promise<void> {
    await api.delete(`/feedback/${id}`);
  },
};
