import { useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const { courses, isLoading, status } = useCourses({ sort: "popular" });
  const featured = courses.slice(0, 4);

  useEffect(() => {
    if (status === "error") {
      toast.error("Couldn't load featured courses — browse the full catalog instead.");
    }
  }, [status]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-700">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-ember-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ember-500">Learn by building</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Forge real skills,
            <br />
            one project at a time.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            Hands-on courses in React, Firebase, and modern web development —
            with real progress tracking, so you always know exactly how far
            you've come.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/courses"
              className="rounded-lg bg-ember-500 px-6 py-3 text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400"
            >
              Browse courses
            </Link>
            <Link
              to="/register"
              className="rounded-lg border border-ink-500 px-6 py-3 text-sm font-semibold transition hover:border-ember-500 hover:text-ember-500"
            >
              Create free account
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 font-mono text-sm text-slate-400">
            <Stat value="6+" label="courses live" />
            <Stat value="8,000+" label="learners" />
            <Stat value="4.7" label="avg. rating" />
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Popular right now</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Featured courses</h2>
          </div>
          <Link to="/courses" className="hidden text-sm font-medium text-ember-500 hover:underline sm:block">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner label="Loading courses…" />
        ) : featured.length === 0 ? (
          <p className="text-sm text-slate-400">Courses couldn't be loaded right now — try the full catalog instead.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-ink-700 bg-ink-800/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold">How SkillForge works</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <HowStep
              title="Pick a course"
              body="Browse by category, difficulty, or technology — search finds courses by title, topic, or tool."
            />
            <HowStep
              title="Learn lesson by lesson"
              body="Work through modules at your pace. Mark lessons complete and pick up exactly where you left off."
            />
            <HowStep
              title="Track real progress"
              body="Your dashboard shows completion across every course you're enrolled in — no guessing."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <span className="text-mist-100">{value}</span>{" "}
      <span className="text-slate-500">{label}</span>
    </div>
  );
}

function HowStep({ title, body }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
      <div className="forge-seam h-1 w-8 rounded-full" />
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </div>
  );
}
