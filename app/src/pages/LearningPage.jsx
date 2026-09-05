import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { getCourseById } from "../services/courseService";
import { getEnrollment, updateProgress, enrollInCourse } from "../services/enrollmentService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import ProgressBar from "../components/ProgressBar";
import { countLessons, progressPercent } from "../utils/format";

function flattenLessons(course) {
  const lessons = [];
  (course?.modules || []).forEach((module) => {
    module.lessons.forEach((lesson) => lessons.push({ ...lesson, moduleId: module.id, moduleTitle: module.title }));
  });
  return lessons;
}

export default function LearningPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeLessonId, setActiveLessonId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCourseById(id), getEnrollment(user.id, id)])
      .then(async ([courseData, enrollmentData]) => {
        if (cancelled || !courseData) {
          setStatus(courseData ? "success" : "notfound");
          return;
        }
        let finalEnrollment = enrollmentData;
        if (!finalEnrollment) {
          finalEnrollment = await enrollInCourse(user.id, id); // auto-enroll if landed directly
        }
        setCourse(courseData);
        setEnrollment(finalEnrollment);
        const lessons = flattenLessons(courseData);
        setActiveLessonId(finalEnrollment.lastLessonId || lessons[0]?.id || null);
        setStatus("success");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const lessons = useMemo(() => flattenLessons(course), [course]);
  const activeLesson = lessons.find((l) => l.id === activeLessonId);
  const activeIndex = lessons.findIndex((l) => l.id === activeLessonId);
  const completedIds = enrollment?.completedLessonIds || [];
  const totalLessons = countLessons(course);
  const percent = progressPercent(completedIds.length, totalLessons);

  async function persistProgress(nextCompletedIds, nextLessonId) {
    const prevEnrollment = enrollment;
    setEnrollment((prev) => ({ ...prev, completedLessonIds: nextCompletedIds, lastLessonId: nextLessonId }));
    try {
      await updateProgress(user.id, id, { completedLessonIds: nextCompletedIds, lastLessonId: nextLessonId });
    } catch {
      setEnrollment(prevEnrollment); // roll back the optimistic update
      toast.error("Couldn't save your progress. Check your connection and try again.");
    }
  }

  async function toggleComplete(lessonId) {
    const isDone = completedIds.includes(lessonId);
    const next = isDone ? completedIds.filter((l) => l !== lessonId) : [...completedIds, lessonId];
    await persistProgress(next, activeLessonId);
    if (!isDone && next.length === totalLessons) {
      toast.success("🎉 Course complete! Great work.");
    } else {
      toast.success(isDone ? "Marked incomplete" : "Lesson marked complete");
    }
  }

  function goToLesson(lessonId) {
    setActiveLessonId(lessonId);
    persistProgress(completedIds, lessonId);
  }

  function goNext() {
    const next = lessons[activeIndex + 1];
    if (next) goToLesson(next.id);
  }
  function goPrev() {
    const prev = lessons[activeIndex - 1];
    if (prev) goToLesson(prev.id);
  }

  if (status === "loading") return <LoadingSpinner full label="Loading lesson…" />;
  if (status === "notfound") return <NotFound />;
  if (status === "error") return <ErrorState message="Couldn't load this course." onRetry={() => window.location.reload()} />;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[300px_1fr]">
      {/* Sidebar: module/lesson list */}
      <aside className="order-2 lg:order-1">
        <Link to={`/courses/${id}`} className="text-xs font-medium text-slate-400 hover:text-ember-500">← Back to course</Link>
        <h2 className="mt-2 font-display text-lg font-bold">{course.title}</h2>
        <div className="mt-3">
          <ProgressBar percent={percent} label={`${completedIds.length}/${totalLessons} lessons`} />
        </div>

        <div className="mt-6 space-y-4">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-slate-400">{module.title}</p>
              <ul className="space-y-1">
                {module.lessons.map((lesson) => {
                  const isDone = completedIds.includes(lesson.id);
                  const isActive = lesson.id === activeLessonId;
                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => goToLesson(lesson.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                          isActive ? "bg-ember-500/10 text-ember-500" : "text-slate-300 hover:bg-ink-800"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isDone ? "bg-success-500" : "bg-ink-500"}`} />
                        <span className="line-clamp-1 flex-1">{lesson.title}</span>
                        <span className="shrink-0 font-mono text-[11px] text-slate-500">{lesson.duration}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main: active lesson */}
      <div className="order-1 lg:order-2">
        {activeLesson ? (
          <>
            <p className="font-mono text-xs uppercase tracking-wide text-ember-500">{activeLesson.moduleTitle}</p>
            <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{activeLesson.title}</h1>

            <div className="mt-6 flex aspect-video w-full items-center justify-center rounded-2xl border border-ink-700 bg-ink-800 text-slate-500">
              <div className="text-center">
                <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
                </svg>
                <p className="font-mono text-xs">Lesson video placeholder · {activeLesson.duration}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                <button
                  onClick={goPrev}
                  disabled={activeIndex <= 0}
                  className="rounded-lg border border-ink-500 px-4 py-2 text-sm font-medium transition hover:border-ember-500 hover:text-ember-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={activeIndex >= lessons.length - 1}
                  className="rounded-lg border border-ink-500 px-4 py-2 text-sm font-medium transition hover:border-ember-500 hover:text-ember-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
              <button
                onClick={() => toggleComplete(activeLesson.id)}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                  completedIds.includes(activeLesson.id)
                    ? "border border-success-500 text-success-500"
                    : "bg-ember-500 text-ink-950 shadow-ember hover:bg-ember-400"
                }`}
              >
                {completedIds.includes(activeLesson.id) ? "Completed ✓" : "Mark as complete"}
              </button>
            </div>

            {percent === 100 && (
              <div className="mt-8 rounded-2xl border border-success-500/30 bg-success-500/5 p-5 text-center">
                <p className="font-display text-lg font-semibold text-success-500">Course complete! 🎉</p>
                <p className="mt-1 text-sm text-slate-400">Nice work — check your dashboard to see it reflected.</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-400">This course doesn't have any lessons yet.</p>
        )}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Course not found</h1>
      <Link to="/courses" className="mt-6 inline-block rounded-lg bg-ember-500 px-5 py-2.5 text-sm font-semibold text-ink-950">
        Browse courses
      </Link>
    </div>
  );
}
