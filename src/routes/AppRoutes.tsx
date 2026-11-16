import React from "react";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { DashboardPage } from "../pages/DashboardPage";
import { AssessmentPage } from "../pages/AssessmentPage";
import { RoadmapPage } from "../pages/RoadmapPage";
import { ResumeAnalyzerPage } from "../pages/ResumeAnalyzerPage";
import { SkillGapPage } from "../pages/SkillGapPage";
import { MarketInsightsPage } from "../pages/MarketInsightsPage";
import { InterviewPrepPage } from "../pages/InterviewPrepPage";
import { CourseRecommendationPage } from "../pages/CourseRecommendationPage";
import { JobRecommendationPage } from "../pages/JobRecommendationPage";
import { FeedbackPage } from "../pages/FeedbackPage";
import { BookmarksPage } from "../pages/BookmarksPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AdminPage } from "../pages/AdminPage";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";

// Merged Pages
import { ChatbotPage } from "../pages/ChatbotPage";
import { CareerComparisonPage } from "../pages/CareerComparisonPage";
import { ProgressTrackerPage } from "../pages/ProgressTrackerPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Main App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/resume" element={<ResumeAnalyzerPage />} />
          <Route path="/skill-gap" element={<SkillGapPage />} />
          <Route path="/market" element={<MarketInsightsPage />} />
          <Route path="/interview" element={<InterviewPrepPage />} />
          <Route path="/courses" element={<CourseRecommendationPage />} />
          <Route path="/jobs" element={<JobRecommendationPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* New Merged Pages */}
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/comparison" element={<CareerComparisonPage />} />
          <Route path="/progress" element={<ProgressTrackerPage />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<DashboardPage />} />
    </Routes>
  );
};
