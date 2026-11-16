export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isMinLength = (value: string, min: number): boolean => {
  return typeof value === "string" && value.trim().length >= min;
};
