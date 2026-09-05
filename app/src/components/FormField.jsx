export default function FormField({
  label,
  id,
  error,
  type = "text",
  as = "input",
  className = "",
  ...props
}) {
  const Comp = as;
  const baseClasses =
    "w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400/70 focus:ring-2 focus:ring-ember-500/30";
  const borderClasses = error ? "border-danger-500" : "border-ink-500 focus:border-ember-500";

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </label>
      ) : null}
      <Comp
        id={id}
        type={as === "input" ? type : undefined}
        className={`${baseClasses} ${borderClasses}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
