import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../utils/validation";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Reset link sent");
    } catch (err) {
      setError(err.message || "Couldn't send a reset link for that email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <Link to="/login" className="font-medium text-ember-500 hover:underline">
          ← Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-success-500/30 bg-success-500/5 p-4 text-sm text-success-500">
          If an account exists for {email}, a reset link is on its way.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-ember-500 py-3 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
