import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { dbStore, IBookmarkDoc } from "../config/db.js";
import { generateMarketData } from "../services/geminiService.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const getMarketInsights = async (req: AuthenticatedRequest, res: Response) => {
  const role = (req.query.role as string) || "Full Stack Developer";

  try {
    const marketData = await generateMarketData(role);
    return sendSuccess(res, marketData);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to fetch market insights", 500);
  }
};

export const bookmarkCareer = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Please log in to save bookmarks", 401);

  const { itemType, title, data } = req.body;
  if (!title || !itemType) {
    return sendError(res, "Bookmark title and itemType are required", 400);
  }

  // Check if already bookmarked
  for (const b of dbStore.bookmarks.values()) {
    if (b.userId === userId && b.title === title && b.itemType === itemType) {
      return sendError(res, "Item is already bookmarked", 400);
    }
  }

  const bookmark: IBookmarkDoc = {
    id: `bm-${Date.now()}`,
    userId,
    itemType,
    title,
    data: data || {},
    createdAt: new Date().toISOString(),
  };

  dbStore.bookmarks.set(bookmark.id, bookmark);
  return sendSuccess(res, bookmark, "Saved to your bookmarks", 201);
};

export const getBookmarks = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return sendError(res, "Unauthorized", 401);

  const bookmarks: IBookmarkDoc[] = [];
  for (const item of dbStore.bookmarks.values()) {
    if (item.userId === userId) {
      bookmarks.push(item);
    }
  }

  return sendSuccess(res, bookmarks);
};

export const deleteBookmark = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) return sendError(res, "Unauthorized", 401);

  const bookmark = dbStore.bookmarks.get(id);
  if (!bookmark || bookmark.userId !== userId) {
    return sendError(res, "Bookmark not found", 404);
  }

  dbStore.bookmarks.delete(id);
  return sendSuccess(res, { id }, "Bookmark removed successfully");
};
