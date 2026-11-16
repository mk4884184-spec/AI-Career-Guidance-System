export const validateQuizInput = (data: any) => {
  const errors: string[] = [];
  if (!data.skills || !Array.isArray(data.skills) || data.skills.length === 0) {
    errors.push("Please select at least one skill");
  }
  if (!data.education) {
    errors.push("Education level is required");
  }
  return errors;
};

export const validateResumeInput = (data: any) => {
  const errors: string[] = [];
  if (!data.pdfBase64 && (!data.resumeText || data.resumeText.trim().length < 20)) {
    errors.push("Please upload a PDF resume or enter resume text (at least 20 characters)");
  }
  return errors;
};
