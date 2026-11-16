import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

export const validateBody = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = requiredFields.filter((field) => {
      const val = req.body[field];
      return val === undefined || val === null || val === "";
    });

    if (missing.length > 0) {
      return sendError(res, `Missing required parameters: ${missing.join(", ")}`, 400);
    }

    next();
  };
};
