import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--color-ember-500)]">404</p>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">Post not found</h1>
      <p className="text-sm text-[var(--color-slate-400)]">
        That article doesn&apos;t exist, or the link is out of date.
      </p>
      <Link href="/" className="mt-2 rounded-lg bg-[var(--color-ember-500)] px-4 py-2 text-sm font-semibold text-[var(--color-ink-950)]">
        Back to the blog
      </Link>
    </div>
  );
}
