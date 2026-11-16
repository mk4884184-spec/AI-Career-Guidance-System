import { Router } from "express";
import { getCourseRecommendations } from "../controllers/courseController.js";

const router = Router();

router.post("/recommendations", getCourseRecommendations);

export default router;
