export function formatDate(value) {
  if (!value) return "";
  const date = value?.seconds ? new Date(value.seconds * 1000) : new Date(value);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function countLessons(course) {
  return (course?.modules || []).reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
}

export function progressPercent(completedCount, totalCount) {
  if (!totalCount) return 0;
  return Math.round((completedCount / totalCount) * 100);
}

/**
 * Enrollment status derived purely from lesson completion counts — no
 * separate field to keep in sync, so it can never drift from reality.
 * Returns 'completed' | 'in-progress' | 'pending'.
 */
export function getEnrollmentStatus(completedCount, totalCount) {
  if (!totalCount) return "pending";
  if (completedCount >= totalCount) return "completed";
  if (completedCount > 0) return "in-progress";
  return "pending";
}
