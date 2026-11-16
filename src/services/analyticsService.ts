import axios from "axios";

const API_BASE_URL = "/api/analytics";

export interface AnalyticsData {
  timeRange: string;
  userGrowthData: Array<{ month: string; users: number; activeUsers: number }>;
  careerChoicesData: Array<{ career: string; count: number }>;
  popularSkillsData: Array<{ skill: string; userCount: number; demandScore: number }>;
  feedbackRatingsData: {
    averageRating: number;
    totalSubmissions: number;
    satisfactionRate: number;
    histogram: Array<{ stars: string; count: number }>;
    categoryBreakdown: Array<{ category: string; rating: number; count: number }>;
  };
  performanceMetrics: {
    avgMatchScore: number;
    avgAtsScore: number;
    totalResumesAnalyzed: number;
    totalRoadmapsGenerated: number;
  };
}

export const analyticsService = {
  getOverview: async (range: string = "all"): Promise<AnalyticsData> => {
    const res = await axios.get(`${API_BASE_URL}/overview`, {
      params: { range },
    });
    return res.data.data;
  },
};
