import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserEnrollments } from "../services/enrollmentService";
import { getCourses } from "../services/courseService";
import { countLessons, progressPercent, getEnrollmentStatus } from "../utils/format";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
];

export default function MyCourses() {
  const { user } = useAuth();
  const [enriched, setEnriched] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [filter, setFilter] = useState("all");

  function load() {
    let cancelled = false;
    setLoadStatus("loading");
    Promise.all([getUserEnrollments(user.id), getCourses()])
      .then(([enrollments, courses]) => {
        if (cancelled) return;
        const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
        const rows = enrollments
          .map((enrollment) => {
            const course = byId[enrollment.courseId];
            if (!course) return null;
            const total = countLessons(course);
            const completed = enrollment.completedLessonIds?.length || 0;
            return {
              enrollment,
              course,
              progress: progressPercent(completed, total),
              enrollmentStatus: getEnrollmentStatus(completed, total),
            };
          })
          .filter(Boolean);
        setEnriched(rows);
        setLoadStatus("success");
      })
      .catch(() => !cancelled && setLoadStatus("error"));
    return () => {
      cancelled = true;
    };
  }

  useEffect(load, [user]);

  const counts = useMemo(() => {
    const c = { all: enriched.length, "in-progress": 0, completed: 0, pending: 0 };
    enriched.forEach((row) => c[row.enrollmentStatus]++);
    return c;
  }, [enriched]);

  const visible = filter === "all" ? enriched : enriched.filter((row) => row.enrollmentStatus === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Learning</p>
      <h1 className="mt-1 font-display text-3xl font-bold">My courses</h1>

      {loadStatus === "success" && enriched.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                filter === f.id
                  ? "border-ember-500 bg-ember-500/10 text-ember-500"
                  : "border-ink-600 text-slate-400 hover:border-slate-400 hover:text-slate-200"
              }`}
            >
              {f.label} <span className="font-mono text-xs opacity-70">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loadStatus === "loading" && <LoadingSpinner label="Loading your courses…" />}
        {loadStatus === "error" && <ErrorState message="Couldn't load your courses." onRetry={load} />}
        {loadStatus === "success" && enriched.length === 0 && (
          <EmptyState
            title="No enrollments yet"
            description="Once you enroll in a course, it'll show up here with your progress."
            action={<Link to="/courses" className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950">Browse courses</Link>}
          />
        )}
        {loadStatus === "success" && enriched.length > 0 && visible.length === 0 && (
          <EmptyState title="No courses in this category" description="Try a different filter above." />
        )}
        {loadStatus === "success" && visible.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(({ course, progress, enrollmentStatus }) => (
              <CourseCard key={course.id} course={course} progress={progress} status={enrollmentStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
