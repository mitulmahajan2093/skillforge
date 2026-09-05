import { Link } from "react-router-dom";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Link to="/" className="mb-8 flex items-center gap-2 font-display text-lg font-bold">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ember-500/15 text-ember-500">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
            <path d="M8 20L16 8L24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8V24" stroke="var(--color-spark-500)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>
        SkillForge
      </Link>
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p> : null}
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6 text-sm text-slate-400">{footer}</div> : null}
    </div>
  );
}
