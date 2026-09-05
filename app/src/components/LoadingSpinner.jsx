export default function LoadingSpinner({ label = "Loading…", size = "md", full = false }) {
  const sizes = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-2", lg: "h-12 w-12 border-[3px]" };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-slate-400">
      <span
        className={`inline-block ${sizes[size]} animate-spin rounded-full border-ember-500 border-t-transparent`}
        role="status"
        aria-label={label}
      />
      {label ? <span className="font-mono text-xs tracking-wide">{label}</span> : null}
    </div>
  );

  if (!full) return spinner;

  return <div className="flex min-h-[50vh] items-center justify-center">{spinner}</div>;
}
