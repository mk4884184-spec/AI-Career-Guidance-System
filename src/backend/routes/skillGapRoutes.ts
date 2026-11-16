import { Router } from "express";
import { analyzeGap, getSkillGapHistory, getSkillGapById } from "../controllers/skillGapController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/analyze", analyzeGap);
router.get("/history", authenticateJWT, getSkillGapHistory);
router.get("/:id", getSkillGapById);

export default router;
