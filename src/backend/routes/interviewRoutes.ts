import { Router } from "express";
import { createInterviewPrep, evaluateAnswer, getInterviewHistory } from "../controllers/interviewController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/generate", createInterviewPrep);
router.post("/evaluate", evaluateAnswer);
router.get("/history", authenticateJWT, getInterviewHistory);

export default router;
