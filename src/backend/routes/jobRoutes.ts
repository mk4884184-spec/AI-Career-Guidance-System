import { Router } from "express";
import { getJobRecommendations } from "../controllers/jobController.js";

const router = Router();

router.post("/recommendations", getJobRecommendations);

export default router;
