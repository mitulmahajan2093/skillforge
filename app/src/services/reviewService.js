import { isFirebaseConfigured, db } from "../firebase/config";
import * as local from "./localStore";
import { seedReviews } from "./mockData";

const REVIEWS = "reviews";
local.seedIfEmpty(REVIEWS, seedReviews);

async function firebaseGetReviewsForCourse(courseId) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(collection(db, REVIEWS), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  const reviews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Sorted client-side rather than via Firestore orderBy, which would
  // require a composite index (courseId + createdAt) that a fresh
  // project doesn't have and won't auto-create.
  return reviews.sort((a, b) => (b.createdAt?.seconds || b.createdAt || 0) - (a.createdAt?.seconds || a.createdAt || 0));
}

async function firebaseAddReview(review) {
  const { collection, addDoc, doc, updateDoc, getDocs, query, where, serverTimestamp } = await import(
    "firebase/firestore"
  );
  const ref = await addDoc(collection(db, REVIEWS), { ...review, createdAt: serverTimestamp() });

  // Recompute course rating average + count
  const q = query(collection(db, REVIEWS), where("courseId", "==", review.courseId));
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => d.data());
  const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
  await updateDoc(doc(db, "courses", review.courseId), { rating: Number(avg.toFixed(2)), reviewCount: all.length });

  return { id: ref.id, ...review };
}

async function mockGetReviewsForCourse(courseId) {
  const items = await local.query(REVIEWS, (r) => r.courseId === courseId);
  return local.withLatency(() => Promise.resolve(items.sort((a, b) => b.createdAt - a.createdAt)));
}

async function mockAddReview(review) {
  const saved = await local.add(REVIEWS, { ...review, createdAt: Date.now() });
  const all = await local.query(REVIEWS, (r) => r.courseId === review.courseId);
  const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
  await local.update("courses", review.courseId, { rating: Number(avg.toFixed(2)), reviewCount: all.length });
  return local.withLatency(() => Promise.resolve(saved));
}

export const getReviewsForCourse = isFirebaseConfigured ? firebaseGetReviewsForCourse : mockGetReviewsForCourse;
export const addReview = isFirebaseConfigured ? firebaseAddReview : mockAddReview;