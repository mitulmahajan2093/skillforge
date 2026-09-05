export const seedCourses = [
  {
    id: "course_react_essentials",
    title: "React Essentials: Components to Production",
    description:
      "A hands-on path through modern React — components, hooks, context, routing, and shipping a real app to production.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    instructor: "Maya Okonkwo",
    category: "Frontend",
    difficulty: "Intermediate",
    duration: "18h 30m",
    technologies: ["React", "Vite", "React Router", "Tailwind CSS"],
    price: 0,
    rating: 4.8,
    reviewCount: 214,
    enrollCount: 3021,
    modules: [
      {
        id: "m1",
        title: "Foundations",
        lessons: [
          { id: "l1", title: "Why components?", duration: "12m", videoUrl: "" },
          { id: "l2", title: "Props and composition", duration: "18m", videoUrl: "" },
          { id: "l3", title: "State and the render cycle", duration: "22m", videoUrl: "" },
        ],
      },
      {
        id: "m2",
        title: "Hooks in depth",
        lessons: [
          { id: "l4", title: "useState and useEffect", duration: "25m", videoUrl: "" },
          { id: "l5", title: "Custom hooks", duration: "20m", videoUrl: "" },
          { id: "l6", title: "Context API", duration: "19m", videoUrl: "" },
        ],
      },
      {
        id: "m3",
        title: "Routing & data",
        lessons: [
          { id: "l7", title: "React Router basics", duration: "17m", videoUrl: "" },
          { id: "l8", title: "Protected routes", duration: "15m", videoUrl: "" },
          { id: "l9", title: "Forms and validation", duration: "21m", videoUrl: "" },
          { id: "l10", title: "Shipping to production", duration: "14m", videoUrl: "" },
        ],
      },
    ],
  },
  {
    id: "course_firebase_backend",
    title: "Firebase for Frontend Developers",
    description:
      "Add a real backend to your app without writing a server: Auth, Firestore, Storage, and Security Rules explained from first principles.",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    instructor: "Daniel Reyes",
    category: "Backend",
    difficulty: "Intermediate",
    duration: "12h 10m",
    technologies: ["Firebase", "Firestore", "Firebase Auth", "Security Rules"],
    price: 0,
    rating: 4.7,
    reviewCount: 156,
    enrollCount: 1874,
    modules: [
      {
        id: "m1",
        title: "Authentication",
        lessons: [
          { id: "l1", title: "Email/password auth", duration: "16m", videoUrl: "" },
          { id: "l2", title: "Auth state and context", duration: "14m", videoUrl: "" },
        ],
      },
      {
        id: "m2",
        title: "Firestore",
        lessons: [
          { id: "l3", title: "Documents and collections", duration: "20m", videoUrl: "" },
          { id: "l4", title: "Queries and indexes", duration: "18m", videoUrl: "" },
          { id: "l5", title: "Writing Security Rules", duration: "24m", videoUrl: "" },
        ],
      },
    ],
  },
  {
    id: "course_nextjs_blog",
    title: "Next.js for Content-Driven Sites",
    description:
      "Build fast, SEO-friendly blogs and marketing sites with the Next.js App Router, layouts, and reusable components.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    instructor: "Priya Chandran",
    category: "Frontend",
    difficulty: "Beginner",
    duration: "9h 45m",
    technologies: ["Next.js", "React", "SEO"],
    price: 0,
    rating: 4.6,
    reviewCount: 98,
    enrollCount: 1290,
    modules: [
      {
        id: "m1",
        title: "App Router basics",
        lessons: [
          { id: "l1", title: "File-based routing", duration: "13m", videoUrl: "" },
          { id: "l2", title: "Layouts and templates", duration: "15m", videoUrl: "" },
        ],
      },
      {
        id: "m2",
        title: "Shipping for search",
        lessons: [
          { id: "l3", title: "Metadata and SEO basics", duration: "17m", videoUrl: "" },
          { id: "l4", title: "Responsive design patterns", duration: "16m", videoUrl: "" },
        ],
      },
    ],
  },
  {
    id: "course_scss_bootstrap",
    title: "Styling Systems: SCSS, Bootstrap & Tailwind",
    description:
      "When to reach for a utility framework, when to write SCSS, and how to keep a design system consistent across a large app.",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
    instructor: "Maya Okonkwo",
    category: "Design",
    difficulty: "Beginner",
    duration: "6h 20m",
    technologies: ["SCSS", "Bootstrap", "Tailwind CSS"],
    price: 0,
    rating: 4.5,
    reviewCount: 61,
    enrollCount: 802,
    modules: [
      {
        id: "m1",
        title: "Picking the right tool",
        lessons: [
          { id: "l1", title: "Utility-first vs. component CSS", duration: "11m", videoUrl: "" },
          { id: "l2", title: "SCSS variables and mixins", duration: "14m", videoUrl: "" },
        ],
      },
    ],
  },
  {
    id: "course_advanced_firestore",
    title: "Advanced Firestore Data Modeling",
    description:
      "Design collections and subcollections that scale: denormalization, security rule patterns, and query performance.",
    thumbnail: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    instructor: "Daniel Reyes",
    category: "Backend",
    difficulty: "Advanced",
    duration: "8h 05m",
    technologies: ["Firestore", "Security Rules"],
    price: 0,
    rating: 4.9,
    reviewCount: 73,
    enrollCount: 540,
    modules: [
      {
        id: "m1",
        title: "Modeling patterns",
        lessons: [
          { id: "l1", title: "Denormalization trade-offs", duration: "19m", videoUrl: "" },
          { id: "l2", title: "Subcollections vs. arrays", duration: "17m", videoUrl: "" },
        ],
      },
    ],
  },
  {
    id: "course_react_router_forms",
    title: "Forms & Validation in React",
    description:
      "Build accessible, resilient forms: controlled inputs, validation strategies, error states, and async submission.",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    instructor: "Priya Chandran",
    category: "Frontend",
    difficulty: "Beginner",
    duration: "5h 15m",
    technologies: ["React", "Forms", "Accessibility"],
    price: 0,
    rating: 4.4,
    reviewCount: 44,
    enrollCount: 610,
    modules: [
      {
        id: "m1",
        title: "Controlled inputs",
        lessons: [
          { id: "l1", title: "Building a validation hook", duration: "15m", videoUrl: "" },
          { id: "l2", title: "Accessible error messaging", duration: "12m", videoUrl: "" },
        ],
      },
    ],
  },
];

export const seedReviews = [
  { id: "r1", courseId: "course_react_essentials", userId: "demo_user", userName: "Alex Kim", rating: 5, comment: "Clear, practical, and the routing section finally made protected routes click for me.", createdAt: Date.now() - 86400000 * 3 },
  { id: "r2", courseId: "course_react_essentials", userId: "demo_user_2", userName: "Jordan Lee", rating: 4, comment: "Great pacing. Would love more on performance optimization.", createdAt: Date.now() - 86400000 * 10 },
  { id: "r3", courseId: "course_firebase_backend", userId: "demo_user", userName: "Sam Patel", rating: 5, comment: "Security Rules explained better than the official docs.", createdAt: Date.now() - 86400000 * 5 },
];
