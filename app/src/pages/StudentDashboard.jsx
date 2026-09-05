import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserEnrollments } from "../services/enrollmentService";
import { getCourses } from "../services/courseService";
import { countLessons, progressPercent, getEnrollmentStatus } from "../utils/format";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");

  function load() {
    let cancelled = false;
    setStatus("loading");
    Promise.all([getUserEnrollments(user.id), getCourses()])
      .then(([e, c]) => {
        if (cancelled) return;
        setEnrollments(e);
        setCourses(c);
        setStatus("success");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }

  useEffect(load, [user]);

  if (status === "loading") return <LoadingSpinner full label="Loading your dashboard…" />;
  if (status === "error") return <ErrorState message="Couldn't load your dashboard." onRetry={load} />;

  const byId = Object.fromEntries(courses.map((c) => [c.id, c]));
  const enriched = enrollments
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

  const totalCourses = enriched.length;
  const inProgressCount = enriched.filter((r) => r.enrollmentStatus === "in-progress").length;
  const completedCourses = enriched.filter((r) => r.enrollmentStatus === "completed").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Dashboard</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Welcome back, {user.name?.split(" ")[0]}</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Enrolled courses" value={totalCourses} />
        <StatCard label="In progress" value={inProgressCount} />
        <StatCard label="Completed" value={completedCourses} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Continue learning</h2>
        <Link to="/my-courses" className="text-sm font-medium text-ember-500 hover:underline">View all</Link>
      </div>

      <div className="mt-5">
        {enriched.length === 0 ? (
          <EmptyState
            title="You haven't enrolled in any courses yet"
            description="Browse the catalog and start your first course today."
            action={
              <Link to="/courses" className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950">
                Browse courses
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enriched.slice(0, 6).map(({ course, progress, enrollmentStatus }) => (
              <CourseCard key={course.id} course={course} progress={progress} status={enrollmentStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-800 p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}
