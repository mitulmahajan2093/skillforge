export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger-500/30 bg-danger-500/5 px-6 py-16 text-center">
      <h3 className="font-display text-lg font-semibold text-danger-500">Couldn't load that</h3>
      <p className="max-w-sm text-sm text-slate-400">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg border border-ink-500 px-4 py-2 text-sm font-medium transition hover:border-ember-500 hover:text-ember-500"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
