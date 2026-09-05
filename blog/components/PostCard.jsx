import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-ink-700)] bg-[var(--color-ink-800)] transition hover:border-[var(--color-ember-500)]/40"
    >
      <div className="aspect-[16/9] overflow-hidden bg-[var(--color-ink-700)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--color-slate-400)]">
          {post.category} · {post.readTime}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug transition group-hover:text-[var(--color-ember-500)]">
          {post.title}
        </h2>
        <p className="line-clamp-2 text-sm text-[var(--color-slate-400)]">{post.excerpt}</p>
        <p className="mt-auto pt-3 text-xs text-[var(--color-slate-400)]">
          {post.author} · {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </div>
    </Link>
  );
}
