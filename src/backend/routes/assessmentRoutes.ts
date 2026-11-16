import { Router } from "express";
import { submitAssessment, getAssessmentHistory, getAssessmentById } from "../controllers/assessmentController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/submit", submitAssessment);
router.get("/history", authenticateJWT, getAssessmentHistory);
router.get("/:id", getAssessmentById);

export default router;
