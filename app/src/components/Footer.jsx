export default function Footer() {
  return (
    <footer className="border-t border-ink-700 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-sm font-semibold">SkillForge</p>
          <p className="mt-1 text-xs text-slate-400">Learn by building. © {new Date().getFullYear()} SkillForge.</p>
        </div>
        <div className="flex gap-6 text-xs text-slate-400">
          <a href="/courses" className="hover:text-ember-500">Courses</a>
          <a href="/blog" className="hover:text-ember-500">Blog</a>
          <a href="/register" className="hover:text-ember-500">Get started</a>
        </div>
      </div>
    </footer>
  );
}
