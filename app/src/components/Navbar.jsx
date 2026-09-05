import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import DarkModeToggle from "./DarkModeToggle";

const navLink = ({ isActive }) =>
  `text-sm font-medium transition hover:text-ember-500 ${isActive ? "text-ember-500" : "text-slate-300"}`;

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out");
    } catch {
      toast.error("Couldn't log out. Try again.");
    } finally {
      setMenuOpen(false);
      navigate("/");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ember-500/15 text-ember-500">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M8 20L16 8L24 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 8V24" stroke="var(--color-spark-500)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
          SkillForge
        </NavLink>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/courses" className={navLink}>Courses</NavLink>
          <a href="/blog" className="text-sm font-medium text-slate-300 transition hover:text-ember-500">Blog</a>
          {isAuthenticated && <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>}
          {isAuthenticated && <NavLink to="/wishlist" className={navLink}>Wishlist</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLink}>Admin</NavLink>}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <DarkModeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NavLink to="/profile" className="text-sm font-medium text-slate-300 transition hover:text-ember-500">
                {user?.name || "Profile"}
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-ink-500 px-3.5 py-1.5 text-sm font-medium transition hover:border-ember-500 hover:text-ember-500"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-ember-500">
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-ember-500 px-3.5 py-1.5 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400"
              >
                Sign up
              </NavLink>
            </div>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink-700 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/courses" className={navLink} onClick={() => setMenuOpen(false)}>Courses</NavLink>
            <a href="/blog" className="text-sm font-medium text-slate-300">Blog</a>
            {isAuthenticated && <NavLink to="/dashboard" className={navLink} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
            {isAuthenticated && <NavLink to="/wishlist" className={navLink} onClick={() => setMenuOpen(false)}>Wishlist</NavLink>}
            {isAdmin && <NavLink to="/admin" className={navLink} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
            <div className="flex items-center justify-between pt-2">
              <DarkModeToggle />
              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-sm font-medium text-slate-300">Log out</button>
              ) : (
                <div className="flex gap-3">
                  <NavLink to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium">Log in</NavLink>
                  <NavLink to="/register" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-ember-500">Sign up</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
