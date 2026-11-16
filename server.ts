import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./src/backend/config/db.js";
import authRoutes from "./src/backend/routes/authRoutes.js";
import assessmentRoutes from "./src/backend/routes/assessmentRoutes.js";
import roadmapRoutes from "./src/backend/routes/roadmapRoutes.js";
import resumeRoutes from "./src/backend/routes/resumeRoutes.js";
import interviewRoutes from "./src/backend/routes/interviewRoutes.js";
import careerRoutes from "./src/backend/routes/careerRoutes.js";
import skillGapRoutes from "./src/backend/routes/skillGapRoutes.js";
import courseRoutes from "./src/backend/routes/courseRoutes.js";
import jobRoutes from "./src/backend/routes/jobRoutes.js";
import feedbackRoutes from "./src/backend/routes/feedbackRoutes.js";
import adminRoutes from "./src/backend/routes/adminRoutes.js";
import analyticsRoutes from "./src/backend/routes/analyticsRoutes.js";
import aiRoutes from "./src/backend/routes/aiRoutes.js";
import { getAnnouncements } from "./src/backend/controllers/adminController.js";
import { errorHandler } from "./src/backend/middleware/errorMiddleware.js";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Connect Database Store
  await connectDB();

  // Express Middlewares
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/assessment", assessmentRoutes);
  app.use("/api/roadmap", roadmapRoutes);
  app.use("/api/resume", resumeRoutes);
  app.use("/api/interview", interviewRoutes);
  app.use("/api/career", careerRoutes);
  app.use("/api/skill-gap", skillGapRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/ai", aiRoutes);
  app.get("/api/announcements", getAnnouncements);

  // Global Error Handler for API routes
  app.use(errorHandler);

  // Serve Frontend via Vite Middleware or Production Static
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AI Career System] Express server active on http://localhost:${PORT}`);
  });
}

startServer();
