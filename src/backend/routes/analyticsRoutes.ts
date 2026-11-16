import { Router } from "express";
import { getAnalyticsOverview } from "../controllers/analyticsController.js";

const router = Router();

// GET /api/analytics/overview
router.get("/overview", getAnalyticsOverview);

export default router;
