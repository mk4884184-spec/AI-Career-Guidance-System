import { api } from "./api";
import { JobRecommendationResponse } from "../types";

export const jobService = {
  async getRecommendations(
    skills: string[],
    education: string,
    experience: string,
    location: string
  ): Promise<JobRecommendationResponse> {
    const response: any = await api.post("/jobs/recommendations", {
      skills,
      education,
      experience,
      location,
    });
    return response.data;
  },
};
