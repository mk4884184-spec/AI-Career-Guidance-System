export const validateRegisterInput = (data: any) => {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length < 2) errors.push("Name must be at least 2 characters long");
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Valid email address is required");
  if (!data.password || data.password.length < 6) errors.push("Password must be at least 6 characters long");
  return errors;
};

export const validateLoginInput = (data: any) => {
  const errors: string[] = [];
  if (!data.email) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");
  return errors;
};

export const validateForgotPasswordInput = (data: any) => {
  const errors: string[] = [];
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("A valid email address is required");
  }
  return errors;
};

export const validateResetPasswordInput = (data: any) => {
  const errors: string[] = [];
  if (!data.token) errors.push("Reset token is required");
  if (!data.newPassword || data.newPassword.length < 6) {
    errors.push("New password must be at least 6 characters long");
  }
  return errors;
};

