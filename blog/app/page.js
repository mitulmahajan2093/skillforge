import Link from "next/link";
import { posts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function HomePage() {
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <section className="mb-14">
        <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--color-ember-500)]">
          SkillForge Blog
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight sm:text-4xl">
          Notes on building with React and Firebase
        </h1>
        <p className="mt-4 max-w-xl text-[var(--color-slate-400)]">
          Practical write-ups from the people building the SkillForge platform — architecture
          decisions, security rules, and the habits that keep a growing codebase readable.
        </p>
      </section>

      {featured && (
        <section className="mb-4">
          <Link
            href={`/${featured.slug}`}
            className="group grid gap-6 overflow-hidden rounded-2xl border border-[var(--color-ink-700)] bg-[var(--color-ink-800)] sm:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[var(--color-ink-700)] sm:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.cover} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center gap-3 p-6">
              <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--color-slate-400)]">
                {featured.category} · {featured.readTime}
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug transition group-hover:text-[var(--color-ember-500)]">
                {featured.title}
              </h2>
              <p className="text-sm text-[var(--color-slate-400)]">{featured.excerpt}</p>
            </div>
          </Link>
        </section>
      )}

      <section className="mt-14">
        <h3 className="mb-5 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[var(--color-slate-400)]">
          More posts
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
