import { Router } from "express";
import { chatbot, getChatHistory, compare, getProjects, getInternships } from "../controllers/aiController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/chatbot", authenticateJWT, chatbot);
router.get("/chatbot/history", authenticateJWT, getChatHistory);
router.post("/compare", authenticateJWT, compare);
router.post("/projects", authenticateJWT, getProjects);
router.post("/internships", authenticateJWT, getInternships);

export default router;
