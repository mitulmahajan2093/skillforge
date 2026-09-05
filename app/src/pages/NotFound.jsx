import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-ember-500">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-sm text-slate-400">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="mt-6 rounded-lg bg-ember-500 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-ember">
        Back to home
      </Link>
    </div>
  );
}
