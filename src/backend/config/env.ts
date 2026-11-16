export const ENV = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "ai-career-guidance-secret-key-2026",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  MONGODB_URI: process.env.MONGODB_URI || "",
  NODE_ENV: process.env.NODE_ENV || "development",
};
