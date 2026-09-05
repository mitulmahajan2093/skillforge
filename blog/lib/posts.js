export const posts = [
  {
    slug: "web-development",
    title: "How React.js and Firebase Are Transforming Modern Web Application Development",
    excerpt:
      "The required capstone article: why the React + Firebase pairing has become a default starting point for teams building real products fast, and what it costs you.",
    category: "Web Development",
    readTime: "9 min read",
    date: "2026-08-10",
    author: "SkillForge Team",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
    content: `
<p>Ten years ago, "building a web app" meant standing up a server, wiring up a database, hand-rolling authentication, and writing the frontend almost as an afterthought. Today a single developer can ship a production-ready, authenticated, real-time application in a weekend — and the pairing most responsible for that shift is React.js on the frontend and Firebase on the backend.</p>

<h2>What React actually changed</h2>
<p>React didn't invent the idea of a component. What it did was make UI a pure function of state: given the same data, a component always renders the same output. That single idea — declarative rendering over imperative DOM manipulation — is why React code tends to be easier to reason about as an app grows. You stop asking "what sequence of DOM operations gets me from state A to state B" and start asking "what does the UI look like when the state is X."</p>
<p>Hooks pushed this further. <code>useState</code> and <code>useEffect</code> let function components hold state and react to lifecycle events without class boilerplate, and the Context API gives you a way to share state — a logged-in user, a theme, a shopping cart — across a component tree without threading props through every layer. Combined with React Router for client-side navigation, you get an app that feels instant, because most transitions never touch the network at all.</p>

<h2>What Firebase actually changed</h2>
<p>Firebase's pitch is blunt: most apps need the same handful of backend primitives — user accounts, a database, file storage, and a way to keep unauthorized users out of data that isn't theirs — and almost none of that logic is unique to your product. Firebase Authentication handles email/password, magic links, and third-party sign-in without you touching a password hash. Firestore gives you a document database that pushes updates to connected clients in real time, which is what makes "live" features (a progress bar that updates instantly, a chat that doesn't need refreshing) cheap to build instead of a research project.</p>
<p>The part teams underestimate is Security Rules. Because Firestore is queried directly from the browser, the rules file <em>is</em> your authorization layer — there's no separate API server enforcing "users can only edit their own data." Writing rules that mirror your actual access model (a student can read their own enrollment, an admin can read anyone's) is not optional hardening; it's the only thing standing between your database and the public internet.</p>

<h2>Why the combination works</h2>
<p>The reason React and Firebase show up together so often isn't that either is uniquely best in class — it's that they remove two different categories of decision fatigue at once. React's Context API plus Firebase's <code>onAuthStateChanged</code> listener gives you a global, always-current picture of "who is logged in right now" in about twenty lines of code. A protected route becomes a component that checks that context and redirects if it's empty. A CRUD admin panel becomes a form that calls a Firestore write and a query that re-renders when the collection changes.</p>
<p>What you give up is control. Firestore's query model is deliberately limited compared to SQL — no arbitrary joins, no complex aggregations — which pushes you toward denormalized, purpose-shaped documents instead of a normalized relational schema. That's a real trade-off, not a free lunch, and it's worth understanding before you commit a large data model to it.</p>

<h2>Where this shows up in practice</h2>
<p>Course platforms, internal tools, marketplaces, and social apps are the sweet spot: enough real-time and auth complexity that hand-rolling a backend is wasted effort, not so much custom business logic that Firestore's query limits become a constant fight. A learning platform is a good example end to end — Firebase Auth for login, Firestore for courses and progress, Storage for thumbnails, and Security Rules making sure a student can only ever write to <em>their own</em> enrollment record, never someone else's.</p>
<p>The skill that actually matters isn't memorizing the API surface of either tool — it's knowing which primitive solves which problem, and being honest about where the abstraction leaks.</p>
`,
  },
  {
    slug: "react-development",
    title: "Thinking in Components: What Makes React Code Age Well",
    excerpt:
      "Composition, one-way data flow, and custom hooks — the habits that separate a React codebase that scales from one that calcifies.",
    category: "Frontend",
    readTime: "6 min read",
    date: "2026-07-22",
    author: "Maya Okonkwo",
    cover: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    content: `
<p>Most React advice focuses on syntax — how <code>useEffect</code> works, when to use <code>useMemo</code>. The harder and more durable skill is structural: deciding what a component owns, and what it hands off to something else.</p>

<h2>Composition over configuration</h2>
<p>A component that accepts fifteen boolean props to control its behavior is a component trying to be several components. The more durable pattern is composition: a small, focused component that does one thing, combined with others through <code>children</code> or explicit props. A <code>Modal</code> that just renders its children inside a dialog shell is more reusable than a <code>Modal</code> that has a <code>confirmMode</code> prop, a <code>formMode</code> prop, and a <code>galleryMode</code> prop bolted on over time.</p>

<h2>State lives where it's read</h2>
<p>The most common source of React bugs is state living in the wrong place — too high, so every keystroke re-renders a page it shouldn't; or too low, so two sibling components can't agree on the truth. The fix is almost always to lift state to the nearest common ancestor that actually needs it, and no further. Context solves the next problem up: state that's genuinely global — the signed-in user, the current theme — without prop-drilling it through ten layers of unrelated components.</p>

<h2>Custom hooks are where logic goes to retire</h2>
<p>Once a piece of stateful logic — debouncing a search input, subscribing to auth state, fetching and filtering a list — is used in more than one place, it belongs in a custom hook, not copy-pasted. A hook like <code>useDebounce(value, delay)</code> is a small thing, but it's the difference between a search box that seems responsive and one that fires a network request on every keystroke.</p>

<h2>Protected routes are just conditional rendering</h2>
<p>It's tempting to treat authentication-gated routing as a separate system. In React it's the same tool you already have: a component that reads auth state from context and either renders its children or redirects. No special framework required — just composition and a router.</p>
`,
  },
  {
    slug: "firebase",
    title: "Firestore Security Rules, Explained From First Principles",
    excerpt:
      "Your rules file isn't a formality — it's the only authorization layer between a client-side database and the public internet.",
    category: "Backend",
    readTime: "7 min read",
    date: "2026-06-30",
    author: "Daniel Reyes",
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
    content: `
<p>New Firestore users often treat Security Rules as an afterthought — something to lock down right before shipping. That's backwards. Because Firestore is queried directly from client code, the rules file is doing the job a traditional API server would normally do: deciding who can read or write what.</p>

<h2>The default is closed, not open</h2>
<p>A fresh Firestore project denies everything by default. Every collection you want accessible has to be explicitly opened, scoped to exactly the condition that should allow it. The habit worth building early: write the narrowest rule that satisfies the feature, not the broadest one that makes the error go away.</p>

<h2>Ownership checks are the workhorse pattern</h2>
<p>The rule you'll write most often is some version of "a signed-in user can read/write a document if that document's <code>userId</code> field matches their own auth UID." For a learning platform, that's what keeps one student from reading — let alone editing — another student's course progress:</p>
<p><code>allow read, write: if request.auth.uid == resource.data.userId;</code></p>
<p>That one line is doing the same job a backend route guard would do in a traditional REST API — except here, there's no route to guard. The rule <em>is</em> the guard.</p>

<h2>Role checks need a source of truth</h2>
<p>Admin-only actions — creating a course, viewing every user — need a way to ask "is this person an admin?" The common pattern is storing a <code>role</code> field on each user's own profile document and having rules look it up with <code>get()</code>. It works, but it means every privileged rule now costs an extra document read, and it means a user's own profile document must never be writable by that same user for the <code>role</code> field — otherwise anyone could self-promote to admin with a single client-side write.</p>

<h2>Rules and queries have to agree</h2>
<p>A subtle failure mode: your rules allow a read, but your query doesn't match what the rules expect, and Firestore rejects the whole query rather than filtering it silently. If a rule says "you may only read documents where <code>userId == request.auth.uid</code>," your query has to include that same <code>where()</code> clause — Firestore won't do the filtering for you after the fact. Rules and queries are two halves of the same contract, and they have to be written together, not separately.</p>
`,
  },
];

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug) || null;
}
