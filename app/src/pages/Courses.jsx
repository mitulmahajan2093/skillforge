import { useState } from "react";
import { useCourses } from "../hooks/useCourses";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../hooks/useAuth";
import CourseCard from "../components/CourseCard";
import CourseFilterBar from "../components/CourseFilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useWishlist } from "../hooks/useWishlist";

export default function Courses() {
  const [filters, setFilters] = useState({ search: "", category: "All", difficulty: "All", sort: "relevance" });
  const debouncedSearch = useDebounce(filters.search, 300);
  const { isAuthenticated } = useAuth();
  const { wishlistIds, toggle } = useWishlist();

  const { courses, status, isLoading } = useCourses({ ...filters, search: debouncedSearch });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-wide text-ember-500">Catalog</p>
        <h1 className="mt-1 font-display text-3xl font-bold">All courses</h1>
        <p className="mt-2 text-sm text-slate-400">{courses.length} course{courses.length === 1 ? "" : "s"} found</p>
      </div>

      <CourseFilterBar filters={filters} onChange={setFilters} />

      <div className="mt-8">
        {isLoading && <LoadingSpinner label="Loading courses…" />}
        {status === "error" && <ErrorState message="Couldn't load the course catalog." onRetry={() => window.location.reload()} />}
        {status === "success" && courses.length === 0 && (
          <EmptyState
            title="No courses match those filters"
            description="Try a different search term or clear a filter."
            action={
              <button
                onClick={() => setFilters({ search: "", category: "All", difficulty: "All", sort: "relevance" })}
                className="rounded-lg border border-ink-500 px-4 py-2 text-sm font-medium hover:border-ember-500 hover:text-ember-500"
              >
                Clear filters
              </button>
            }
          />
        )}
        {status === "success" && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                wished={wishlistIds.includes(course.id)}
                onWishlistToggle={isAuthenticated ? toggle : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
