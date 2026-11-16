import { Router } from "express";
import { analyzeResume, getResumeHistory } from "../controllers/resumeController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/analyze", analyzeResume);
router.get("/history", authenticateJWT, getResumeHistory);

export default router;
