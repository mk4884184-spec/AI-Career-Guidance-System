import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IFeedbackDoc } from "../config/db.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { randomUUID } from "crypto";

// Submit Feedback (User)
export const submitFeedback = async (req: AuthenticatedRequest, res: Response) => {
  const { rating, feedbackText, category, userName, userEmail } = req.body;

  if (!rating || !feedbackText) {
    return sendError(res, "Rating and feedback text are required", 400);
  }

  const numericRating = Number(rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return sendError(res, "Rating must be a number between 1 and 5", 400);
  }

  try {
    const feedbackId = `fb-${randomUUID()}`;
    const newFeedback: IFeedbackDoc = {
      id: feedbackId,
      userId: req.user?.userId || "guest-user",
      userName: userName || req.user?.name || "Anonymous User",
      userEmail: userEmail || req.user?.email || "user@example.com",
      rating: numericRating,
      category: category || "General Feedback",
      feedbackText: feedbackText.trim(),
      createdAt: new Date().toISOString(),
    };

    dbStore.feedbacks.set(feedbackId, newFeedback);

    return sendSuccess(res, newFeedback, "Thank you! Your feedback has been submitted successfully.", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to submit feedback", 500);
  }
};

// View All Feedback (Admin / Public view)
export const getAllFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const feedbacks = Array.from(dbStore.feedbacks.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate Average Rating & Summary Metrics
    const totalCount = feedbacks.length;
    const avgRating = totalCount > 0
      ? feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalCount
      : 0;

    return sendSuccess(
      res,
      {
        feedbacks,
        stats: {
          totalCount,
          averageRating: Number(avgRating.toFixed(1)),
          fiveStarCount: feedbacks.filter((f) => f.rating === 5).length,
        },
      },
      "Feedback records retrieved successfully"
    );
  } catch (error: any) {
    return sendError(res, error.message || "Failed to fetch feedback records", 500);
  }
};

// Delete Feedback (Admin)
export const deleteFeedback = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return sendError(res, "Feedback ID is required", 400);
  }

  try {
    if (!dbStore.feedbacks.has(id)) {
      return sendError(res, "Feedback record not found", 404);
    }

    dbStore.feedbacks.delete(id);
    return sendSuccess(res, { deletedId: id }, "Feedback entry deleted successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to delete feedback entry", 500);
  }
};
