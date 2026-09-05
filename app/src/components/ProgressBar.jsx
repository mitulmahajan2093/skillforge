export default function ProgressBar({ percent = 0, label, showLabel = true, size = "md" }) {
  const clamped = Math.max(0, Math.min(100, percent));
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };

  return (
    <div className="w-full">
      {showLabel ? (
        <div className="mb-1.5 flex items-center justify-between font-mono text-xs text-slate-400">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div className={`relative w-full overflow-hidden rounded-full bg-ink-700 ${heights[size]}`}>
        <div
          className="forge-seam h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
