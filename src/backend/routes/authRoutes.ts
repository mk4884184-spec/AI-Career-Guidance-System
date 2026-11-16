import { Router } from "express";
import { register, login, adminLogin, forgotPassword, resetPassword, logout, getProfile, updateProfile } from "../controllers/authController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/profile", authenticateJWT, getProfile);
router.put("/profile", authenticateJWT, updateProfile);

export default router;

