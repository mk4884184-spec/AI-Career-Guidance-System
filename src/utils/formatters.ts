export const formatMatchScore = (score: number): { text: string; color: string; bg: string } => {
  if (score >= 90) {
    return { text: "Excellent Match", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" };
  } else if (score >= 80) {
    return { text: "High Match", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" };
  } else if (score >= 70) {
    return { text: "Moderate Match", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" };
  }
  return { text: "Potential Match", color: "text-slate-700 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" };
};

export const formatDate = (dateString: string): string => {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateString;
  }
};
