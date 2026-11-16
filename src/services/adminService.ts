import { api } from "./api.js";
import { User, ManagedCareer, ManagedCourse, AdminStats, FeedbackItem } from "../types.js";

export const adminService = {
  // Admin Login
  adminLogin: async (email: string, password: string) => {
    const res: any = await api.post("/auth/admin-login", { email, password });
    if (res.data?.token) {
      localStorage.setItem("ai_career_token", res.data.token);
      localStorage.setItem("ai_career_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  // Get Admin Dashboard Overview Statistics
  getAdminStats: async (): Promise<AdminStats> => {
    const res: any = await api.get("/admin/stats");
    return res.data;
  },

  // View Users
  getUsers: async (search?: string, status?: string): Promise<User[]> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    const res: any = await api.get(`/admin/users?${params.toString()}`);
    return res.data;
  },

  // Toggle Block/Unblock User
  toggleBlockUser: async (userId: string): Promise<User> => {
    const res: any = await api.patch(`/admin/users/${userId}/block`);
    return res.data;
  },

  // Delete User
  deleteUser: async (userId: string) => {
    const res: any = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },

  // Managed Careers
  getCareers: async (): Promise<ManagedCareer[]> => {
    const res: any = await api.get("/admin/careers");
    return res.data;
  },

  addCareer: async (data: Partial<ManagedCareer>): Promise<ManagedCareer> => {
    const res: any = await api.post("/admin/careers", data);
    return res.data;
  },

  updateCareer: async (id: string, data: Partial<ManagedCareer>): Promise<ManagedCareer> => {
    const res: any = await api.put(`/admin/careers/${id}`, data);
    return res.data;
  },

  deleteCareer: async (id: string) => {
    const res: any = await api.delete(`/admin/careers/${id}`);
    return res.data;
  },

  // Managed Courses
  getCourses: async (): Promise<ManagedCourse[]> => {
    const res: any = await api.get("/admin/courses");
    return res.data;
  },

  addCourse: async (data: Partial<ManagedCourse>): Promise<ManagedCourse> => {
    const res: any = await api.post("/admin/courses", data);
    return res.data;
  },

  updateCourse: async (id: string, data: Partial<ManagedCourse>): Promise<ManagedCourse> => {
    const res: any = await api.put(`/admin/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id: string) => {
    const res: any = await api.delete(`/admin/courses/${id}`);
    return res.data;
  },

  // Get Feedback list
  getFeedbackList: async (): Promise<FeedbackItem[]> => {
    const res: any = await api.get("/feedback");
    return res.data;
  },

  // Delete Feedback
  deleteFeedback: async (id: string) => {
    const res: any = await api.delete(`/admin/feedback/${id}`);
    return res.data;
  },

  // Platform System Report
  getReports: async () => {
    const res: any = await api.get("/admin/reports");
    return res.data;
  },
};
