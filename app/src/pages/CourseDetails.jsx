import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import { getCourseById } from "../services/courseService";
import { enrollInCourse, getEnrollment } from "../services/enrollmentService";
import { getReviewsForCourse, addReview } from "../services/reviewService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import RatingStars from "../components/RatingStars";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import FormField from "../components/FormField";
import { countLessons, progressPercent, formatDate, getEnrollmentStatus } from "../utils/format";

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { wishlistIds, toggle } = useWishlist();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [status, setStatus] = useState("loading");
  const [enrolling, setEnrolling] = useState(false);
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    Promise.all([
      getCourseById(id),
      getReviewsForCourse(id),
      isAuthenticated ? getEnrollment(user.id, id) : Promise.resolve(null),
    ])
      .then(([courseData, reviewData, enrollmentData]) => {
        if (cancelled) return;
        if (!courseData) {
          setStatus("notfound");
          return;
        }
        setCourse(courseData);
        setReviews(reviewData);
        setEnrollment(enrollmentData);
        setStatus("success");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated, user]);

  async function handleEnroll() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    setEnrolling(true);
    try {
      const e = await enrollInCourse(user.id, id);
      setEnrollment(e);
      toast.success("Enrolled! Let's start learning.");
      navigate(`/learn/${id}`);
    } catch (err) {
      toast.error(err.message || "Couldn't enroll right now.");
    } finally {
      setEnrolling(false);
    }
  }

  if (status === "loading") return <LoadingSpinner full label="Loading course…" />;
  if (status === "notfound") return <NotFoundBlock />;
  if (status === "error") return <ErrorState message="Couldn't load this course." onRetry={() => window.location.reload()} />;

  const totalLessons = countLessons(course);
  const completed = enrollment?.completedLessonIds?.length || 0;
  const wished = wishlistIds.includes(course.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-wide text-ember-500">{course.category} · {course.difficulty}</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{course.title}</h1>
          <p className="mt-4 text-base text-slate-400">{course.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <RatingStars value={course.rating || 0} />
            <span>{course.reviewCount} reviews</span>
            <span>{course.enrollCount} students</span>
            <span>{course.duration}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {course.technologies?.map((t) => (
              <span key={t} className="rounded-full border border-ink-600 px-3 py-1 text-xs text-slate-300">{t}</span>
            ))}
          </div>

          <img src={course.thumbnail} alt="" className="mt-8 aspect-video w-full rounded-2xl object-cover" />

          {/* Curriculum */}
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">Curriculum</h2>
            <p className="mt-1 text-sm text-slate-400">{course.modules?.length || 0} modules · {totalLessons} lessons</p>
            <div className="mt-4 space-y-3">
              {course.modules?.map((module, idx) => (
                <div key={module.id} className="overflow-hidden rounded-xl border border-ink-700">
                  <button
                    onClick={() => setOpenModule(openModule === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between bg-ink-800 px-4 py-3 text-left"
                  >
                    <span className="font-medium">{module.title}</span>
                    <span className="font-mono text-xs text-slate-400">{module.lessons.length} lessons</span>
                  </button>
                  {openModule === idx && (
                    <ul className="divide-y divide-ink-700">
                      {module.lessons.map((lesson) => {
                        const isDone = enrollment?.completedLessonIds?.includes(lesson.id);
                        return (
                          <li key={lesson.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                              <span className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-success-500" : "bg-ink-500"}`} />
                              {lesson.title}
                            </span>
                            <span className="font-mono text-xs text-slate-500">{lesson.duration}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold">Reviews</h2>
            {enrollment && <ReviewForm courseId={course.id} user={user} onAdded={(r) => setReviews((prev) => [r, ...prev])} />}
            <div className="mt-6 space-y-5">
              {reviews.length === 0 && <p className="text-sm text-slate-400">No reviews yet — be the first.</p>}
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-ink-700 pb-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.userName}</span>
                    <span className="font-mono text-xs text-slate-500">{formatDate(r.createdAt)}</span>
                  </div>
                  <RatingStars value={r.rating} showValue={false} size={13} />
                  <p className="mt-2 text-sm text-slate-400">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-ink-700 bg-ink-800 p-6">
            {enrollment ? (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Your status</span>
                  <StatusBadge status={getEnrollmentStatus(completed, totalLessons)} />
                </div>
                <ProgressBar percent={progressPercent(completed, totalLessons)} label={`${completed}/${totalLessons} lessons`} />
                <Link
                  to={`/learn/${course.id}`}
                  className="mt-5 block w-full rounded-lg bg-ember-500 py-3 text-center text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400"
                >
                  Continue learning
                </Link>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-bold">Free</p>
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="mt-4 block w-full rounded-lg bg-ember-500 py-3 text-center text-sm font-semibold text-ink-950 shadow-ember transition hover:bg-ember-400 disabled:opacity-60"
                >
                  {enrolling ? "Enrolling…" : "Enroll now"}
                </button>
              </>
            )}
            <button
              onClick={() => toggle(course.id)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-500 py-2.5 text-sm font-medium transition hover:border-ember-500 hover:text-ember-500"
            >
              {wished ? "Remove from wishlist" : "Add to wishlist"}
            </button>

            <dl className="mt-6 space-y-3 border-t border-ink-700 pt-6 text-sm">
              <Row label="Instructor" value={course.instructor} />
              <Row label="Duration" value={course.duration} />
              <Row label="Lessons" value={totalLessons} />
              <Row label="Level" value={course.difficulty} />
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function ReviewForm({ courseId, user, onAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Write a short comment before submitting.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const review = await addReview({ courseId, userId: user.id, userName: user.name, rating, comment: comment.trim() });
      onAdded(review);
      setComment("");
      toast.success("Review posted");
    } catch {
      toast.error("Couldn't post your review. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-ink-700 bg-ink-800 p-4">
      <p className="mb-2 text-sm font-medium">Leave a review</p>
      <RatingStars value={rating} onChange={setRating} readOnly={false} showValue={false} size={20} />
      <FormField
        as="textarea"
        id="review-comment"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think of this course?"
        error={error}
        className="mt-3"
      />
      <button
        type="submit"
        disabled={submitting}
        className="mt-3 rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-ember-400 disabled:opacity-60"
      >
        {submitting ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}

function NotFoundBlock() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">Course not found</h1>
      <p className="mt-2 text-sm text-slate-400">It may have been removed or the link is incorrect.</p>
      <Link to="/courses" className="mt-6 inline-block rounded-lg bg-ember-500 px-5 py-2.5 text-sm font-semibold text-ink-950">
        Browse courses
      </Link>
    </div>
  );
}
