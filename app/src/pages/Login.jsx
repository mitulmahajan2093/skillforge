import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../utils/validation";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {
      email: validateEmail(form.email),
      password: form.password ? null : "Password is required.",
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const loggedInUser = await login(form);
      toast.success("Welcome back!");
      navigate(loggedInUser.role === "admin" ? "/admin" : from, {
        replace: true,
      });
    } catch (err) {
      setFormError(err.message || "Couldn't log in. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to continue your courses."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-ember-500 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-slate-400 hover:text-ember-500"
          >
            Forgot password?
          </Link>
        </div>
        {formError ? (
          <p className="text-sm text-danger-500">{formError}</p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-ember-500 py-3 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400 disabled:opacity-60"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-400">
    Admin Account
  </p>

  <div className="space-y-2 text-xs">
    <button
      type="button"
      onClick={() =>
        setForm((f) => ({
          ...f,
          email: "admin@skillforge.dev",
        }))
      }
      className="block w-full rounded-md bg-ink-800 px-3 py-2 text-left font-mono text-slate-300 transition hover:bg-ink-700"
    >
      Email:{" "}
      <span className="font-semibold text-white">
        admin@skillforge.dev
      </span>
    </button>

    <button
      type="button"
      onClick={() =>
        setForm((f) => ({
          ...f,
          password: "admin123",
        }))
      }
      className="block w-full rounded-md bg-ink-800 px-3 py-2 text-left font-mono text-slate-300 transition hover:bg-ink-700"
    >
      Password:{" "}
      <span className="font-semibold text-white">
        admin123
      </span>
    </button>
  </div>

  <p className="mt-3 text-xs text-slate-500">
    Click the email or password to automatically fill the login form.
  </p>
</div>
    </AuthCard>
  );
}
