import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Authentication token missing or invalid format", 401);
  }

  const token = authHeader.split(" ")[1];

  if (token === "guest-token") {
    req.user = {
      userId: "guest-user",
      email: "guest@example.com",
      name: "Guest Explorer",
      role: "user"
    };
    return next();
  }

  const payload = verifyToken(token);

  if (!payload) {
    return sendError(res, "Session expired or invalid token. Please log in again.", 401);
  }

  req.user = payload;
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return sendError(res, "Access denied: Administrator privileges required.", 403);
  }
  next();
};
