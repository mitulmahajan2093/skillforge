import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../services/courseService";
import { useWishlist } from "../hooks/useWishlist";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function Wishlist() {
  const { wishlistIds, loading: wishlistLoading, toggle } = useWishlist();
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");

  function load() {
    setStatus("loading");
    getCourses()
      .then(setCourses)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  const wishedCourses = courses.filter((c) => wishlistIds.includes(c.id));
  const isLoading = wishlistLoading || status === "loading";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Saved</p>
      <h1 className="mt-1 font-display text-3xl font-bold">Wishlist</h1>

      <div className="mt-8">
        {isLoading && <LoadingSpinner label="Loading your wishlist…" />}
        {!isLoading && status === "error" && (
          <ErrorState message="Couldn't load your wishlist." onRetry={load} />
        )}
        {!isLoading && status === "success" && wishedCourses.length === 0 && (
          <EmptyState
            title="Your wishlist is empty"
            description="Save courses you're interested in to come back to them later."
            action={<Link to="/courses" className="rounded-lg bg-ember-500 px-4 py-2 text-sm font-semibold text-ink-950">Browse courses</Link>}
          />
        )}
        {!isLoading && status === "success" && wishedCourses.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishedCourses.map((course) => (
              <CourseCard key={course.id} course={course} wished onWishlistToggle={toggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
