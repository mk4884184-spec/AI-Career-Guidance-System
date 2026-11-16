import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("[ServerError]:", err);
  const status = err.status || 500;
  const message = err.message || "An unexpected server error occurred";
  return sendError(res, message, status);
};
