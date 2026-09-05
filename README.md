# SkillForge

A modern, responsive online learning platform. Users browse courses, register/log in,
enroll, track learning progress, and manage their profile. Admins manage the course
catalog. A separate Next.js app powers the SkillForge blog.

This repo has two independent projects:

```
skillforge/
├── app/    ← React + Vite main application (courses, auth, dashboard, admin)
└── blog/   ← Next.js blog (SEO-friendly articles, deployed at /blog)
```

---

## Why two apps, one platform

The React app and the Next.js blog are genuinely different frameworks with their own
dev servers and build tools — they can't literally run as one process. What makes them
feel like *one platform* is that both are served from a single origin:

- **In dev**, `npm run dev` at the repo root starts both servers and proxies
  `app`'s Vite dev server (`:5173`) so that `/blog/*` transparently forwards to the
  Next.js server (`:3000`). Visit `http://localhost:5173` for the whole platform —
  you never need to touch port 3000 directly.
- **In production**, the same idea is done at the hosting layer: `vercel.json` (Vercel)
  or `firebase.json` (Firebase Hosting) rewrites `/blog/*` on the main domain to the
  separately-deployed Next.js app. One domain, one platform, two codebases underneath.

## Quick start

### 0. Run everything together (recommended)

```bash
npm run install:all   # installs both app/ and blog/
npm run dev            # starts both dev servers + the proxy, from repo root
```

Open **http://localhost:5173** — course pages, auth, dashboard, and `/blog` all live
under the same origin, exactly like production.

### 1. Main app only (`app/`)

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

**No setup required to try it.** The app ships in **demo mode**: a localStorage-backed
mock backend with the exact same function signatures as the real Firebase calls, seeded
with sample courses, a demo admin account, and sample reviews. Every screen — auth,
enrollment, progress tracking, wishlist, reviews, the admin dashboard — works immediately.

Demo admin login: `admin@skillforge.dev` / `admin123`
(or register a new account — new accounts default to the `student` role)

### 2. Connect a real Firebase project (optional)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**, **Firestore**, and **Storage**
3. Copy `app/.env.example` to `app/.env.local` and fill in your web app's config
4. Deploy the included rules: `firebase deploy --only firestore:rules` (see `app/firestore.rules`)
5. Restart the dev server — the app now talks to live Firebase. No other code changes needed;
   every file in `src/services/` picks the Firebase implementation automatically once
   `VITE_FIREBASE_API_KEY` is set.

### 3. Blog only (`blog/`)

```bash
cd blog
npm install
npm run dev        # http://localhost:3000/blog
```

The blog's `basePath` is set to `/blog` in `next.config.mjs`, so in production it's
deployed alongside the main app and reverse-proxied so `skillforge.dev/blog/*` resolves
to this Next.js app while everything else resolves to the React app — matching the
`/blog`, `/blog/react-development`, `/blog/firebase` structure from the spec.

---

## Tech stack

| Layer      | Tech |
|------------|------|
| Main app   | React 19, Vite, React Router, Tailwind CSS v4, Context API |
| Backend    | Firebase Auth, Firestore, Storage, Security Rules |
| Blog       | Next.js (App Router), SSG, SEO metadata |
| Dev        | Git/GitHub, deployable to Vercel or Firebase Hosting |

## Project structure (`app/src`)

```
src/
├── components/   Reusable UI: Navbar, CourseCard, ProgressBar, Modal, route guards…
├── pages/        Route-level screens (Home, Courses, Dashboard, Admin…)
├── hooks/        useAuth, useTheme, useCourses, useDebounce, useLocalStorage
├── context/       AuthContext, ThemeContext
├── services/     authService, courseService, enrollmentService, reviewService,
│                 storageService — each has a real-Firebase path and a demo-mode
│                 fallback behind the same function signature
├── firebase/     config.js — reads env vars, exposes isFirebaseConfigured
└── utils/        validation.js, format.js
```

## User roles

- **Student** — register/login, browse & search/filter/sort courses, view details,
  enroll, learn (mark lessons complete, resume where they left off), wishlist,
  leave reviews, manage their profile.
- **Admin** — everything a student can do, plus a dashboard to add/edit/delete
  courses (with modules & lessons), and view users and enrollments.

## React concepts demonstrated

Components & props · state & hooks (`useState`, `useEffect`, `useMemo`) · Context API
(`AuthContext`, `ThemeContext`) · custom hooks · React Router with protected/admin-only
routes · controlled forms with inline validation · conditional rendering · reusable
components · Firestore CRUD wired through a service layer · loading / error / empty
states throughout · dark/light mode persisted to `localStorage`.

## Firestore Security Rules

See `app/firestore.rules`. Summary of the access model:

- Anyone can read the course catalog; only admins can write courses.
- A user can read/update their own profile; admins can read (not silently rewrite) any
  profile, and only admins can change a user's `role`.
- A user can only read/write their **own** enrollment, progress, and wishlist records;
  admins can read all enrollments for the admin dashboard.
- Anyone signed in can read reviews; a user can only create a review under their own
  identity and can only edit/delete their own.

## Deployment

Both apps deploy separately, then get stitched under one domain via rewrites so the
platform still looks and feels unified:

- **Vercel**: deploy `app/` and `blog/` as two separate Vercel projects, then use the
  root-level `vercel.json` to rewrite `/blog/*` on the main project's domain to the
  blog project's deployment URL (swap in your real blog deployment URL).
- **Firebase Hosting**: deploy `app/dist` as the primary Hosting target, and run the
  Next.js blog on Cloud Run (or Cloud Functions) behind the `run` rewrite in the
  root-level `firebase.json`.
- Add your production Firebase config as environment variables in your hosting
  provider's dashboard (same keys as `app/.env.example`)

## Required blog article

The capstone's assigned article, *"How React.js and Firebase Are Transforming Modern
Web Application Development,"* is published at `blog/lib/posts.js` (slug
`web-development`) and live at `/blog/web-development` once the blog is running.
