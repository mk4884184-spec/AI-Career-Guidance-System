import { Router } from "express";
import { getMarketInsights, bookmarkCareer, getBookmarks, deleteBookmark } from "../controllers/careerController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/market-insights", getMarketInsights);
router.post("/bookmarks", authenticateJWT, bookmarkCareer);
router.get("/bookmarks", authenticateJWT, getBookmarks);
router.delete("/bookmarks/:id", authenticateJWT, deleteBookmark);

export default router;
