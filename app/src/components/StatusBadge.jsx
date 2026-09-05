const DEFAULT_STYLES = {
  completed: "bg-success-500/10 text-success-500",
  "in-progress": "bg-spark-500/10 text-spark-500",
  pending: "bg-ink-700 text-slate-400",
};

const OVERLAY_STYLES = {
  completed: "bg-success-500/90 text-ink-950",
  "in-progress": "bg-spark-500/90 text-ink-950",
  pending: "bg-ink-950/80 text-slate-300 backdrop-blur",
};

const LABELS = {
  completed: "Completed",
  "in-progress": "In progress",
  pending: "Pending",
};

export default function StatusBadge({ status, variant = "default", className = "" }) {
  const styles = variant === "overlay" ? OVERLAY_STYLES : DEFAULT_STYLES;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || styles.pending} ${className}`}
    >
      {status === "completed" ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {LABELS[status] || LABELS.pending}
    </span>
  );
}
