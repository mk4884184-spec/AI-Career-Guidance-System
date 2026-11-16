import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { dbStore, IUserDoc } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/response.js";
import {
  validateRegisterInput,
  validateLoginInput,
  validateForgotPasswordInput,
  validateResetPasswordInput,
} from "../validators/authValidator.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const register = async (req: Request, res: Response) => {
  const errors = validateRegisterInput(req.body);
  if (errors.length > 0) {
    return sendError(res, errors.join("; "), 400);
  }

  const { name, email, password, targetRole, skills, experienceLevel, education } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user exists
  for (const user of dbStore.users.values()) {
    if (user.email === normalizedEmail) {
      return sendError(res, "An account with this email address already exists", 400);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: IUserDoc = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name,
    email: normalizedEmail,
    passwordHash,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    targetRole: targetRole || "Software Engineer",
    skills: Array.isArray(skills) ? skills : ["JavaScript", "HTML/CSS"],
    experienceLevel: experienceLevel || "Entry Level",
    education: education || "Bachelor's Degree",
    createdAt: new Date().toISOString(),
  };

  dbStore.users.set(newUser.id, newUser);

  const token = signToken({ userId: newUser.id, email: newUser.email, name: newUser.name });

  const { passwordHash: _, resetPasswordToken: __, resetPasswordExpires: ___, ...safeUser } = newUser;

  return sendSuccess(res, { user: safeUser, token }, "Registration successful", 201);
};

export const login = async (req: Request, res: Response) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return sendError(res, errors.join("; "), 400);
  }

  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  let foundUser: IUserDoc | null = null;
  for (const user of dbStore.users.values()) {
    if (user.email === normalizedEmail) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    return sendError(res, "Invalid email or password", 401);
  }

  if (foundUser.isBlocked) {
    return sendError(res, "Your account has been suspended or blocked by an administrator.", 403);
  }

  const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
  if (!isMatch) {
    return sendError(res, "Invalid email or password", 401);
  }

  const token = signToken({
    userId: foundUser.id,
    email: foundUser.email,
    name: foundUser.name,
    role: foundUser.role || "user",
  });
  const { passwordHash: _, resetPasswordToken: __, resetPasswordExpires: ___, ...safeUser } = foundUser;

  return sendSuccess(res, { user: safeUser, token }, "Login successful");
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, "Admin email and password are required", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();

  let foundAdmin: IUserDoc | null = null;
  for (const user of dbStore.users.values()) {
    if (user.email === normalizedEmail && user.role === "admin") {
      foundAdmin = user;
      break;
    }
  }

  if (!foundAdmin) {
    return sendError(res, "Invalid admin credentials or account does not have admin privileges", 401);
  }

  if (foundAdmin.isBlocked) {
    return sendError(res, "This administrator account is blocked.", 403);
  }

  const isMatch = await bcrypt.compare(password, foundAdmin.passwordHash);
  if (!isMatch) {
    return sendError(res, "Invalid admin credentials", 401);
  }

  const token = signToken({
    userId: foundAdmin.id,
    email: foundAdmin.email,
    name: foundAdmin.name,
    role: "admin",
  });

  const { passwordHash: _, resetPasswordToken: __, resetPasswordExpires: ___, ...safeAdmin } = foundAdmin;

  return sendSuccess(res, { user: safeAdmin, token }, "Admin authentication successful");
};

export const forgotPassword = async (req: Request, res: Response) => {
  const errors = validateForgotPasswordInput(req.body);
  if (errors.length > 0) {
    return sendError(res, errors.join("; "), 400);
  }

  const { email } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  let foundUser: IUserDoc | null = null;
  for (const user of dbStore.users.values()) {
    if (user.email === normalizedEmail) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    // For security reasons, still respond with generic message or helpful notification
    return sendSuccess(
      res,
      { sent: true },
      "If an account with that email exists, password reset instructions have been generated."
    );
  }

  // Generate random 32-character hex reset token & set expiry (1 hour)
  const resetToken = crypto.randomBytes(16).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  foundUser.resetPasswordToken = resetToken;
  foundUser.resetPasswordExpires = tokenExpiry;
  dbStore.users.set(foundUser.id, foundUser);

  return sendSuccess(
    res,
    { resetToken, email: foundUser.email },
    `Password reset token generated successfully. Use token '${resetToken}' to reset your password.`
  );
};

export const resetPassword = async (req: Request, res: Response) => {
  const errors = validateResetPasswordInput(req.body);
  if (errors.length > 0) {
    return sendError(res, errors.join("; "), 400);
  }

  const { token, newPassword } = req.body;

  let foundUser: IUserDoc | null = null;
  for (const user of dbStore.users.values()) {
    if (
      user.resetPasswordToken === token &&
      user.resetPasswordExpires &&
      new Date(user.resetPasswordExpires).getTime() > Date.now()
    ) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    return sendError(res, "Invalid or expired password reset token", 400);
  }

  const salt = await bcrypt.genSalt(10);
  foundUser.passwordHash = await bcrypt.hash(newPassword, salt);
  foundUser.resetPasswordToken = undefined;
  foundUser.resetPasswordExpires = undefined;

  dbStore.users.set(foundUser.id, foundUser);

  return sendSuccess(res, null, "Password has been reset successfully. You can now log in with your new password.");
};

export const logout = async (req: Request, res: Response) => {
  return sendSuccess(res, null, "Logged out successfully");
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return sendError(res, "Unauthorized", 401);

  const user = dbStore.users.get(req.user.userId);
  if (!user) return sendError(res, "User not found", 404);

  const { passwordHash: _, resetPasswordToken: __, resetPasswordExpires: ___, ...safeUser } = user;
  return sendSuccess(res, safeUser);
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return sendError(res, "Unauthorized", 401);

  const user = dbStore.users.get(req.user.userId);
  if (!user) return sendError(res, "User not found", 404);

  const {
    name,
    email,
    phone,
    targetRole,
    skills,
    experienceLevel,
    experience,
    education,
    college,
    degree,
    interests,
    preferredLocation,
    careerGoal,
    languages,
    linkedin,
    github,
    bio,
    avatar,
  } = req.body;

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (targetRole !== undefined) user.targetRole = targetRole;
  if (skills && Array.isArray(skills)) user.skills = skills;
  if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
  if (experience !== undefined) user.experience = experience;
  if (education !== undefined) user.education = education;
  if (college !== undefined) user.college = college;
  if (degree !== undefined) user.degree = degree;
  if (interests && Array.isArray(interests)) user.interests = interests;
  if (preferredLocation !== undefined) user.preferredLocation = preferredLocation;
  if (careerGoal !== undefined) user.careerGoal = careerGoal;
  if (languages && Array.isArray(languages)) user.languages = languages;
  if (linkedin !== undefined) user.linkedin = linkedin;
  if (github !== undefined) user.github = github;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  dbStore.users.set(user.id, user);

  const { passwordHash: _, resetPasswordToken: __, resetPasswordExpires: ___, ...safeUser } = user;
  return sendSuccess(res, safeUser, "Profile updated successfully");
};

