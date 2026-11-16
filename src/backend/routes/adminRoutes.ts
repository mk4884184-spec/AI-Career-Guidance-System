import { Router } from "express";
import { authenticateJWT, requireAdmin } from "../middleware/authMiddleware.js";
import {
  getAdminStats,
  getUsers,
  toggleBlockUser,
  deleteUser,
  getCareers,
  addCareer,
  updateCareer,
  deleteCareer,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  deleteFeedback,
  getReports,
  createAnnouncement,
  deleteAnnouncement,
  getActivityLogs,
  getNotifications,
  markNotificationsRead,
} from "../controllers/adminController.js";

const router = Router();

// Protect all admin routes with JWT and Admin role verification
router.use(authenticateJWT, requireAdmin);

// Stats & Overview
router.get("/stats", getAdminStats);

// User Management
router.get("/users", getUsers);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

// Manage System Careers
router.get("/careers", getCareers);
router.post("/careers", addCareer);
router.put("/careers/:id", updateCareer);
router.delete("/careers/:id", deleteCareer);

// Manage System Courses
router.get("/courses", getCourses);
router.post("/courses", addCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Feedback Management
router.delete("/feedback/:id", deleteFeedback);

// System Announcements
router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

// Activity logs & notifications
router.get("/activity-logs", getActivityLogs);
router.get("/notifications", getNotifications);
router.post("/notifications/read", markNotificationsRead);

// Reports
router.get("/reports", getReports);

export default router;
