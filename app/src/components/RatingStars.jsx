export default function RatingStars({ value = 0, onChange, readOnly = true, size = 16, showValue = true }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => {
          const filled = star <= Math.round(value);
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className={readOnly ? "cursor-default" : "cursor-pointer transition hover:scale-110"}
            >
              <svg width={size} height={size} viewBox="0 0 20 20" fill={filled ? "var(--color-spark-500)" : "none"} stroke="var(--color-spark-500)" strokeWidth="1.2">
                <path d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8l-5.2 2.7 1-5.8L1.6 7.6l5.8-.8L10 1.5z" strokeLinejoin="round" />
              </svg>
            </button>
          );
        })}
      </div>
      {showValue ? <span className="font-mono text-xs text-slate-400">{value.toFixed ? value.toFixed(1) : value}</span> : null}
    </div>
  );
}
