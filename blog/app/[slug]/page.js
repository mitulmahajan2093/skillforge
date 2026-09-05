import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover }],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/" className="text-sm text-[var(--color-slate-400)] transition hover:text-[var(--color-ember-500)]">
        ← All posts
      </Link>

      <header className="mt-6 mb-8">
        <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--color-ember-500)]">
          {post.category} · {post.readTime}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-sm text-[var(--color-slate-400)]">
          {post.author} ·{" "}
          {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </header>

      <div className="mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--color-ink-700)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="prose-forge" dangerouslySetInnerHTML={{ __html: post.content }} />

      {related.length > 0 && (
        <aside className="mt-16 border-t border-[var(--color-ink-700)] pt-8">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[var(--color-slate-400)]">
            Keep reading
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="rounded-xl border border-[var(--color-ink-700)] p-4 text-sm font-medium transition hover:border-[var(--color-ember-500)]/40 hover:text-[var(--color-ember-500)]"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
