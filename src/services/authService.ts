import { api } from "./api";
import { User } from "../types";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  async register(data: { name: string; email: string; password: string; targetRole?: string; skills?: string[]; experienceLevel?: string; education?: string }) {
    const res: any = await api.post("/auth/register", data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res: any = await api.post("/auth/login", data);
    return res.data;
  },

  async forgotPassword(email: string) {
    const res: any = await api.post("/auth/forgot-password", { email });
    return res;
  },

  async resetPassword(token: string, newPassword: string) {
    const res: any = await api.post("/auth/reset-password", { token, newPassword });
    return res;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    }
  },

  async getProfile(): Promise<User> {
    const res: any = await api.get("/auth/profile");
    return res.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res: any = await api.put("/auth/profile", data);
    return res.data;
  },
};

