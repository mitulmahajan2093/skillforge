/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed alongside the main SkillForge React app (e.g. reverse-proxied
  // or as a Vercel rewrite), so every route here already lives under /blog:
  // "/" -> skillforge.dev/blog, "/react-development" -> skillforge.dev/blog/react-development.
  basePath: "/blog",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // The repo root also has a package-lock.json (for the `concurrently`
  // dev-orchestration script), which makes Turbopack's root auto-detection
  // ambiguous. Pin it explicitly to this app.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
