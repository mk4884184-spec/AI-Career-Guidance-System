import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AssessmentData, RoadmapData, ResumeAnalysisData, BookmarkItem, CareerRecommendation } from "../types";
import { careerService } from "../services/careerService";

export interface CareerGoal {
  targetRole: string;
  targetSalary: string;
  targetDate: string;
  keyFocus: string;
}

interface CareerContextType {
  latestAssessment: AssessmentData | null;
  setLatestAssessment: (data: AssessmentData | null) => void;
  activeRoadmap: RoadmapData | null;
  setActiveRoadmap: (data: RoadmapData | null) => void;
  latestResume: ResumeAnalysisData | null;
  setLatestResume: (data: ResumeAnalysisData | null) => void;
  bookmarks: BookmarkItem[];
  fetchBookmarks: () => Promise<void>;
  addBookmark: (itemType: "career" | "roadmap" | "resource", title: string, data: any) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (title: string) => boolean;
  recentlyViewed: CareerRecommendation[];
  addRecentlyViewed: (career: CareerRecommendation) => void;
  careerGoal: CareerGoal;
  updateCareerGoal: (goal: Partial<CareerGoal>) => void;
}

export const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [latestAssessment, setLatestAssessment] = useState<AssessmentData | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapData | null>(null);
  const [latestResume, setLatestResume] = useState<ResumeAnalysisData | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<CareerRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem("ai_career_recently_viewed");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [careerGoal, setCareerGoal] = useState<CareerGoal>(() => {
    try {
      const saved = localStorage.getItem("ai_career_goal");
      return saved
        ? JSON.parse(saved)
        : {
            targetRole: "Full Stack Engineer",
            targetSalary: "₹15,00,000/year",
            targetDate: "6 Months",
            keyFocus: "Master System Design & React 19",
          };
    } catch {
      return {
        targetRole: "Full Stack Engineer",
        targetSalary: "₹15,00,000/year",
        targetDate: "6 Months",
        keyFocus: "Master System Design & React 19",
      };
    }
  });

  const fetchBookmarks = async () => {
    try {
      const data = await careerService.getBookmarks();
      setBookmarks(data);
    } catch {
      // Ignored if unauthenticated or error
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const addBookmark = async (itemType: "career" | "roadmap" | "resource", title: string, data: any) => {
    const newItem = await careerService.bookmarkItem(itemType, title, data);
    setBookmarks((prev) => [newItem, ...prev]);
  };

  const removeBookmark = async (id: string) => {
    await careerService.removeBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isBookmarked = (title: string) => {
    return bookmarks.some((b) => b.title === title);
  };

  const addRecentlyViewed = (career: CareerRecommendation) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((c) => c.title !== career.title);
      const updated = [career, ...filtered].slice(0, 6);
      try {
        localStorage.setItem("ai_career_recently_viewed", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateCareerGoal = (newGoal: Partial<CareerGoal>) => {
    setCareerGoal((prev) => {
      const updated = { ...prev, ...newGoal };
      try {
        localStorage.setItem("ai_career_goal", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <CareerContext.Provider
      value={{
        latestAssessment,
        setLatestAssessment,
        activeRoadmap,
        setActiveRoadmap,
        latestResume,
        setLatestResume,
        bookmarks,
        fetchBookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        recentlyViewed,
        addRecentlyViewed,
        careerGoal,
        updateCareerGoal,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

