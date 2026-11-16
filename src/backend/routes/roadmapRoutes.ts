import { Router } from "express";
import { createRoadmap, getUserRoadmaps, togglePhaseCompletion } from "../controllers/roadmapController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/generate", createRoadmap);
router.get("/user", authenticateJWT, getUserRoadmaps);
router.patch("/:id/phase", authenticateJWT, togglePhaseCompletion);

export default router;
