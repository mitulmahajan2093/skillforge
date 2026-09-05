import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import FormField from "../components/FormField";
import { validateName } from "../utils/validation";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't save your profile. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const initials = (user?.name || "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Account</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Profile</h1>

      <div className="mt-8 flex items-center gap-4 rounded-2xl border border-ink-700 bg-ink-800 p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ember-500/15 font-display text-xl font-bold text-ember-500">
          {initials}
        </div>
        <div>
          <p className="font-display text-lg font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-ink-700 px-2.5 py-0.5 text-xs capitalize text-slate-300">
            {user?.role}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-ink-700 bg-ink-800 p-6">
        <FormField id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
        <FormField
          as="textarea"
          id="bio"
          label="Bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell other learners a little about yourself…"
        />
        <FormField id="email" label="Email" value={user?.email || ""} disabled className="opacity-60" />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ember-500 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
