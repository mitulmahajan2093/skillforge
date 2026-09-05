import Link from "next/link";

const MAIN_APP_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5173" : "/");

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-ink-700)] bg-[var(--color-ink-900)]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-ember-500)]/15 text-[var(--color-ember-500)]">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 20L16 8L24 20"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 8V24"
                stroke="var(--color-spark-500)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          SkillForge{" "}
          <span className="text-[var(--color-slate-400)] font-medium">
            / Blog
          </span>
        </Link>
        <a
          href={MAIN_APP_URL}
          className="rounded-lg bg-[var(--color-ember-500)] px-3.5 py-1.5 text-sm font-semibold text-[var(--color-ink-950)] transition hover:bg-[var(--color-ember-400)]"
        >
          Browse courses
        </a>
      </nav>
    </header>
  );
}
