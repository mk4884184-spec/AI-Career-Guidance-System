import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IManagedCareerDoc, IManagedCourseDoc, IUserDoc, IAnnouncementDoc, IActivityLogDoc, INotificationDoc } from "../config/db.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { randomUUID } from "crypto";

// Get Overall Admin Dashboard Statistics & Chart Data
export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allUsers = Array.from(dbStore.users.values());
    const totalUsers = allUsers.length;
    const blockedUsers = allUsers.filter((u) => u.isBlocked).length;
    const activeUsers = totalUsers - blockedUsers;

    const totalRoadmaps = dbStore.roadmaps.size;
    const totalResumesAnalyzed = dbStore.resumes.size;
    const totalAssessmentsTaken = dbStore.assessments.size;

    const allFeedbacks = Array.from(dbStore.feedbacks.values());
    const totalFeedbackCount = allFeedbacks.length;
    const averageFeedbackRating =
      totalFeedbackCount > 0
        ? Number(
            (allFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / totalFeedbackCount).toFixed(1)
          )
        : 5.0;

    // Role Distribution calculation
    const roleCounts: Record<string, number> = {};
    allUsers.forEach((u) => {
      const role = u.targetRole || "Software Engineer";
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const roleDistribution = Object.entries(roleCounts).map(([roleName, count]) => ({
      roleName,
      count,
    }));

    // Mock/Calculated User Signup Trends (Last 6 Months)
    const userSignupTrends = [
      { month: "Feb", signups: 12 },
      { month: "Mar", signups: 19 },
      { month: "Apr", signups: 28 },
      { month: "May", signups: 42 },
      { month: "Jun", signups: 55 },
      { month: "Jul", signups: Math.max(totalUsers, 65) },
    ];

    // ATS Score Distribution calculation
    const allResumes = Array.from(dbStore.resumes.values());
    let score0to50 = 0;
    let score51to70 = 0;
    let score71to85 = 0;
    let score86to100 = 0;

    allResumes.forEach((r) => {
      const score = r.atsScore || r.overallScore || 70;
      if (score <= 50) score0to50++;
      else if (score <= 70) score51to70++;
      else if (score <= 85) score71to85++;
      else score86to100++;
    });

    // If no resumes evaluated yet, provide benchmark dataset for visual chart display
    const atsScoreDistribution =
      allResumes.length > 0
        ? [
            { range: "0 - 50", count: score0to50 },
            { range: "51 - 70", count: score51to70 },
            { range: "71 - 85", count: score71to85 },
            { range: "86 - 100", count: score86to100 },
          ]
        : [
            { range: "0 - 50", count: 2 },
            { range: "51 - 70", count: 8 },
            { range: "71 - 85", count: 18 },
            { range: "86 - 100", count: 14 },
          ];

    return sendSuccess(
      res,
      {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalRoadmaps,
        totalResumesAnalyzed,
        totalAssessmentsTaken,
        totalFeedbackCount,
        averageFeedbackRating,
        roleDistribution,
        userSignupTrends,
        atsScoreDistribution,
      },
      "Admin stats retrieved successfully"
    );
  } catch (err: any) {
    return sendError(res, err.message || "Failed to retrieve admin stats", 500);
  }
};

// View All Users (with search & filter)
export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status } = req.query;
    let usersList = Array.from(dbStore.users.values()).map((u) => {
      const { passwordHash, resetPasswordToken, resetPasswordExpires, ...safeUser } = u;
      return safeUser;
    });

    if (search && typeof search === "string") {
      const term = search.toLowerCase();
      usersList = usersList.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.targetRole && u.targetRole.toLowerCase().includes(term))
      );
    }

    if (status && typeof status === "string") {
      if (status === "blocked") {
        usersList = usersList.filter((u) => u.isBlocked);
      } else if (status === "active") {
        usersList = usersList.filter((u) => !u.isBlocked);
      }
    }

    return sendSuccess(res, usersList, "Users retrieved successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to fetch users", 500);
  }
};

// Toggle Block/Unblock User
export const toggleBlockUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const user = dbStore.users.get(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.role === "admin" && user.id === req.user?.userId) {
      return sendError(res, "You cannot block your own active admin account", 400);
    }

    const updatedUser: IUserDoc = {
      ...user,
      isBlocked: !user.isBlocked,
    };

    dbStore.users.set(userId, updatedUser);

    const { passwordHash, ...safeUser } = updatedUser;
    const actionText = updatedUser.isBlocked ? "blocked" : "unblocked";
    return sendSuccess(res, safeUser, `User successfully ${actionText}`);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to update user status", 500);
  }
};

// Delete User
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const user = dbStore.users.get(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.role === "admin") {
      return sendError(res, "Admin accounts cannot be deleted directly from user view", 400);
    }

    dbStore.users.delete(userId);
    return sendSuccess(res, { deletedUserId: userId }, "User account deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to delete user", 500);
  }
};

// Manage Careers: Get
export const getCareers = async (req: Request, res: Response) => {
  try {
    const careers = Array.from(dbStore.careers.values());
    return sendSuccess(res, careers, "Managed careers retrieved successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to fetch careers", 500);
  }
};

// Manage Careers: Add
export const addCareer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, category, avgSalary, growthOutlook, demandLevel, requiredSkills, description, activeJobsCount } = req.body;

    if (!title || !category || !avgSalary) {
      return sendError(res, "Title, category, and average salary are required", 400);
    }

    const newCareer: IManagedCareerDoc = {
      id: `car-${randomUUID().slice(0, 8)}`,
      title,
      category,
      avgSalary,
      growthOutlook: growthOutlook || "+20% (2024-2030)",
      demandLevel: demandLevel || "High",
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      description: description || "",
      activeJobsCount: Number(activeJobsCount) || 5000,
      createdAt: new Date().toISOString(),
    };

    dbStore.careers.set(newCareer.id, newCareer);
    return sendSuccess(res, newCareer, "New career path added successfully", 201);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to add career path", 500);
  }
};

// Manage Careers: Update
export const updateCareer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbStore.careers.get(id);

    if (!existing) {
      return sendError(res, "Career path not found", 404);
    }

    const updated: IManagedCareerDoc = {
      ...existing,
      ...req.body,
      id: existing.id,
    };

    dbStore.careers.set(id, updated);
    return sendSuccess(res, updated, "Career path updated successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to update career path", 500);
  }
};

// Manage Careers: Delete
export const deleteCareer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!dbStore.careers.has(id)) {
      return sendError(res, "Career path not found", 404);
    }

    dbStore.careers.delete(id);
    return sendSuccess(res, { deletedId: id }, "Career path deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to delete career path", 500);
  }
};

// Manage Courses: Get
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = Array.from(dbStore.courses.values());
    return sendSuccess(res, courses, "Managed courses retrieved successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to fetch courses", 500);
  }
};

// Manage Courses: Add
export const addCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, provider, type, level, duration, category, rating, courseUrl } = req.body;

    if (!title || !provider || !courseUrl) {
      return sendError(res, "Title, provider, and course URL are required", 400);
    }

    const newCourse: IManagedCourseDoc = {
      id: `crs-${randomUUID().slice(0, 8)}`,
      title,
      provider,
      type: type || "Paid",
      level: level || "Intermediate",
      duration: duration || "4 Weeks",
      category: category || "Software Engineering",
      rating: Number(rating) || 4.7,
      courseUrl,
      createdAt: new Date().toISOString(),
    };

    dbStore.courses.set(newCourse.id, newCourse);
    return sendSuccess(res, newCourse, "Course recommendation added successfully", 201);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to add course", 500);
  }
};

// Manage Courses: Update
export const updateCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = dbStore.courses.get(id);

    if (!existing) {
      return sendError(res, "Course not found", 404);
    }

    const updated: IManagedCourseDoc = {
      ...existing,
      ...req.body,
      id: existing.id,
    };

    dbStore.courses.set(id, updated);
    return sendSuccess(res, updated, "Course updated successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to update course", 500);
  }
};

// Manage Courses: Delete
export const deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!dbStore.courses.has(id)) {
      return sendError(res, "Course not found", 404);
    }

    dbStore.courses.delete(id);
    return sendSuccess(res, { deletedId: id }, "Course deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to delete course", 500);
  }
};

// Delete Feedback
export const deleteFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!dbStore.feedbacks.has(id)) {
      return sendError(res, "Feedback item not found", 404);
    }

    dbStore.feedbacks.delete(id);
    return sendSuccess(res, { deletedId: id }, "Feedback entry deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to delete feedback entry", 500);
  }
};

// Generate & Download Comprehensive Platform System Reports
export const getReports = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allUsers = Array.from(dbStore.users.values());
    const allFeedbacks = Array.from(dbStore.feedbacks.values());
    const allCareers = Array.from(dbStore.careers.values());
    const allCourses = Array.from(dbStore.courses.values());

    const summary = {
      generatedAt: new Date().toISOString(),
      platformName: "AI Career Guidance System",
      metrics: {
        totalRegisteredUsers: allUsers.length,
        activeUsers: allUsers.filter((u) => !u.isBlocked).length,
        blockedUsers: allUsers.filter((u) => u.isBlocked).length,
        totalRoadmapsCreated: dbStore.roadmaps.size,
        totalResumesEvaluated: dbStore.resumes.size,
        totalSkillGapsAnalyzed: dbStore.skillGaps.size,
        totalManagedCareers: allCareers.length,
        totalManagedCourses: allCourses.length,
        totalFeedbackReceived: allFeedbacks.length,
      },
      userRoster: allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        targetRole: u.targetRole,
        role: u.role || "user",
        status: u.isBlocked ? "Blocked" : "Active",
        createdAt: u.createdAt,
      })),
    };

    return sendSuccess(res, summary, "Platform system report generated successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to generate report", 500);
  }
};

// Get all announcements (public, can be accessed by admin or users)
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const list = Array.from(dbStore.announcements.values());
    // Sort by date descending
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sendSuccess(res, list);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to fetch announcements", 500);
  }
};

// Create Announcement (admin only)
export const createAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return sendError(res, "Title and content are required", 400);
  }

  try {
    const newAnn: IAnnouncementDoc = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      author: req.user?.email || "System Admin"
    };

    dbStore.announcements.set(newAnn.id, newAnn);
    return sendSuccess(res, newAnn, "Announcement created successfully", 201);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to create announcement", 500);
  }
};

// Delete Announcement (admin only)
export const deleteAnnouncement = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (!dbStore.announcements.has(id)) {
      return sendError(res, "Announcement not found", 404);
    }

    dbStore.announcements.delete(id);
    return sendSuccess(res, { deletedId: id }, "Announcement deleted successfully");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to delete announcement", 500);
  }
};

// Get Activity Logs (admin only)
export const getActivityLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = Array.from(dbStore.activityLogs.values());
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return sendSuccess(res, logs);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to fetch activity logs", 500);
  }
};

// Get Admin Notifications (admin only)
export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const list = Array.from(dbStore.notifications.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sendSuccess(res, list);
  } catch (err: any) {
    return sendError(res, err.message || "Failed to fetch notifications", 500);
  }
};

// Mark All Notifications as Read (admin only)
export const markNotificationsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    for (const n of dbStore.notifications.values()) {
      n.read = true;
      dbStore.notifications.set(n.id, n);
    }
    return sendSuccess(res, null, "All notifications marked as read");
  } catch (err: any) {
    return sendError(res, err.message || "Failed to update notifications", 500);
  }
};
