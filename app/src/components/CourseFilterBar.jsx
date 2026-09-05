const CATEGORIES = ["All", "Frontend", "Backend", "Design"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
const SORTS = [
  { value: "relevance", label: "Most relevant" },
  { value: "rating", label: "Highest rated" },
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
];

export default function CourseFilterBar({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-700 bg-ink-800 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Search courses, technologies, instructors…"
          className="w-full rounded-lg border border-ink-500 bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-ember-500 focus:ring-2 focus:ring-ember-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={filters.category}
          onChange={(e) => set("category", e.target.value)}
          className="rounded-lg border border-ink-500 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-ember-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All categories" : c}</option>
          ))}
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => set("difficulty", e.target.value)}
          className="rounded-lg border border-ink-500 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-ember-500"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d === "All" ? "All levels" : d}</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value)}
          className="rounded-lg border border-ink-500 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-ember-500"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
