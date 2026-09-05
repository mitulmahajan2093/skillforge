import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import StatusBadge from "./StatusBadge";
import { countLessons } from "../utils/format";

const difficultyColor = {
  Beginner: "text-success-500 bg-success-500/10",
  Intermediate: "text-spark-500 bg-spark-500/10",
  Advanced: "text-ember-500 bg-ember-500/10",
};

export default function CourseCard({ course, onWishlistToggle, wished = false, progress, status }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-800 transition hover:border-ember-500/40 hover:shadow-ember">
      <Link to={`/courses/${course.id}`} className="relative block aspect-video overflow-hidden bg-ink-700">
        <img
          src={course.thumbnail}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${difficultyColor[course.difficulty] || ""}`}>
          {course.difficulty}
        </span>
        {status && (
          <StatusBadge status={status} variant="overlay" className="absolute right-3 top-3" />
        )}
        {onWishlistToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle(course.id);
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/70 text-mist-100 backdrop-blur transition hover:text-ember-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? "var(--color-ember-500)" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7.5-4.6-10-9.1C.5 8.3 2.3 5 5.8 5c2 0 3.4 1 4.2 2.2C10.8 6 12.2 5 14.2 5c3.5 0 5.3 3.3 3.8 6.9C19.5 16.4 12 21 12 21z" />
            </svg>
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{course.category}</p>
          <Link to={`/courses/${course.id}`}>
            <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug transition group-hover:text-ember-500">
              {course.title}
            </h3>
          </Link>
        </div>

        <p className="line-clamp-2 text-sm text-slate-400">{course.description}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <RatingStars value={course.rating || 0} size={13} />
          <span className="font-mono text-xs text-slate-400">{countLessons(course)} lessons</span>
        </div>

        {typeof progress === "number" ? (
          <div className="pt-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
              <div className="forge-seam h-full rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-400">{progress}% complete</p>
          </div>
        ) : (
          <div className="flex items-center justify-between border-t border-ink-700 pt-3 text-xs text-slate-400">
            <span>{course.instructor}</span>
            <span>{course.duration}</span>
          </div>
        )}
      </div>
    </div>
  );
}
