import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../utils/validation";
import { isFirebaseConfigured } from "../firebase/config";

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
      {!isFirebaseConfigured && (
        <p className="mt-6 rounded-lg border border-ink-700 bg-ink-800 p-3 font-mono text-xs text-slate-400">
          Admin: admin@skillforge.dev / admin123
        </p>
      )}
    </AuthCard>
  );
}
