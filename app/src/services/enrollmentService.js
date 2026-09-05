import { isFirebaseConfigured, db } from "../firebase/config";
import * as local from "./localStore";

const ENROLLMENTS = "enrollments";
const WISHLIST = "wishlist";

function enrollmentDocId(userId, courseId) {
  return `${userId}_${courseId}`;
}

// --- Real Firestore implementation --------------------------------------
async function firebaseEnroll(userId, courseId) {
  const { doc, setDoc, serverTimestamp, increment, updateDoc } = await import("firebase/firestore");
  const id = enrollmentDocId(userId, courseId);
  await setDoc(doc(db, ENROLLMENTS, id), {
    userId,
    courseId,
    completedLessonIds: [],
    lastLessonId: null,
    enrolledAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "courses", courseId), { enrollCount: increment(1) });
  return { id, userId, courseId, completedLessonIds: [], lastLessonId: null };
}

async function firebaseGetUserEnrollments(userId) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(collection(db, ENROLLMENTS), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function firebaseGetEnrollment(userId, courseId) {
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, ENROLLMENTS, enrollmentDocId(userId, courseId)));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function firebaseUpdateProgress(userId, courseId, { completedLessonIds, lastLessonId }) {
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, ENROLLMENTS, enrollmentDocId(userId, courseId)), {
    completedLessonIds,
    lastLessonId,
  });
  return true;
}

async function firebaseToggleWishlist(userId, courseId) {
  const { doc, getDoc, setDoc, deleteDoc } = await import("firebase/firestore");
  const id = enrollmentDocId(userId, courseId);
  const ref = doc(db, WISHLIST, id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await deleteDoc(ref);
    return false;
  }
  await setDoc(ref, { userId, courseId, addedAt: Date.now() });
  return true;
}

async function firebaseGetWishlist(userId) {
  const { collection, query, where, getDocs } = await import("firebase/firestore");
  const q = query(collection(db, WISHLIST), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().courseId);
}

// --- Demo implementation --------------------------------------------------
async function mockEnroll(userId, courseId) {
  const id = enrollmentDocId(userId, courseId);
  const existing = await local.getById(ENROLLMENTS, id);
  if (existing) return existing;
  const course = await local.getById("courses", courseId);
  if (course) await local.update("courses", courseId, { enrollCount: (course.enrollCount || 0) + 1 });
  return local.withLatency(() =>
    local.add(ENROLLMENTS, { id, userId, courseId, completedLessonIds: [], lastLessonId: null, enrolledAt: Date.now() })
  );
}

async function mockGetUserEnrollments(userId) {
  return local.withLatency(() => local.query(ENROLLMENTS, (e) => e.userId === userId));
}

async function mockGetEnrollment(userId, courseId) {
  return local.withLatency(() => local.getById(ENROLLMENTS, enrollmentDocId(userId, courseId)));
}

async function mockUpdateProgress(userId, courseId, { completedLessonIds, lastLessonId }) {
  return local.withLatency(() =>
    local.update(ENROLLMENTS, enrollmentDocId(userId, courseId), { completedLessonIds, lastLessonId })
  );
}

async function mockToggleWishlist(userId, courseId) {
  const id = enrollmentDocId(userId, courseId);
  const existing = await local.getById(WISHLIST, id);
  if (existing) {
    await local.remove(WISHLIST, id);
    return false;
  }
  await local.add(WISHLIST, { id, userId, courseId, addedAt: Date.now() });
  return true;
}

async function mockGetWishlist(userId) {
  const items = await local.query(WISHLIST, (w) => w.userId === userId);
  return items.map((i) => i.courseId);
}

// --- Public API -------------------------------------------------------------
export const enrollInCourse = isFirebaseConfigured ? firebaseEnroll : mockEnroll;
export const getUserEnrollments = isFirebaseConfigured ? firebaseGetUserEnrollments : mockGetUserEnrollments;
export const getEnrollment = isFirebaseConfigured ? firebaseGetEnrollment : mockGetEnrollment;
export const updateProgress = isFirebaseConfigured ? firebaseUpdateProgress : mockUpdateProgress;
export const toggleWishlist = isFirebaseConfigured ? firebaseToggleWishlist : mockToggleWishlist;
export const getWishlistCourseIds = isFirebaseConfigured ? firebaseGetWishlist : mockGetWishlist;
