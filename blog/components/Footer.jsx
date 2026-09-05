export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-ink-700)] py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-[var(--color-slate-400)]">
          © {new Date().getFullYear()} SkillForge. Part of the SkillForge learning platform.
        </p>
        <p className="text-xs text-[var(--color-slate-400)]">Built with Next.js</p>
      </div>
    </footer>
  );
}
