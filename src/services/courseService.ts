import { api } from "./api";
import { CourseRecommendationResponse } from "../types";

export const courseService = {
  async getRecommendations(careerGoal: string, missingSkills: string[]): Promise<CourseRecommendationResponse> {
    const response: any = await api.post("/courses/recommendations", {
      careerGoal,
      missingSkills,
    });
    return response.data;
  },
};
