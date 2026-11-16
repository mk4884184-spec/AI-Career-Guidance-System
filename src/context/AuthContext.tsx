import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; targetRole?: string; skills?: string[]; experienceLevel?: string; education?: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("ai_career_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("ai_career_token");
      if (storedToken && storedToken !== "guest-token") {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setToken(storedToken);
        } catch {
          localStorage.setItem("ai_career_token", "guest-token");
          setToken("guest-token");
          setUser({
            id: "guest-user",
            name: "Guest Explorer",
            email: "guest@example.com",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            targetRole: "Full Stack Software Engineer",
            skills: ["React", "JavaScript", "HTML/CSS", "Python", "Problem Solving"],
            experienceLevel: "Entry Level",
            education: "Bachelor's Degree",
            bio: "Exploring career opportunities in tech and modern software development.",
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // Set up guest / demo fallback profile for instant preview if no token exists
        localStorage.setItem("ai_career_token", "guest-token");
        setToken("guest-token");
        setUser({
          id: "guest-user",
          name: "Guest Explorer",
          email: "guest@example.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          targetRole: "Full Stack Software Engineer",
          skills: ["React", "JavaScript", "HTML/CSS", "Python", "Problem Solving"],
          experienceLevel: "Entry Level",
          education: "Bachelor's Degree",
          bio: "Exploring career opportunities in tech and modern software development.",
          createdAt: new Date().toISOString(),
        });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("ai_career_token", data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; targetRole?: string; skills?: string[]; experienceLevel?: string; education?: string }) => {
    setIsLoading(true);
    try {
      const resData = await authService.register(data);
      setUser(resData.user);
      setToken(resData.token);
      localStorage.setItem("ai_career_token", resData.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("ai_career_token");
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (token: string, newPassword: string) => {
    return await authService.resetPassword(token, newPassword);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
