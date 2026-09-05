import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword, validateName, validateConfirmPassword } from "../utils/validation";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
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
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success("Account created — welcome to SkillForge!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message || "Couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start learning in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ember-500 hover:underline">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField id="name" name="name" label="Full name" autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField id="email" name="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" name="password" label="Password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
        <FormField id="confirmPassword" name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        {formError ? <p className="text-sm text-danger-500">{formError}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-ember-500 py-3 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
