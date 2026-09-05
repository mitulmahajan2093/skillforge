import { isFirebaseConfigured, db } from "../firebase/config";
import * as local from "./localStore";
import { seedCourses } from "./mockData";

const COURSES = "courses";
local.seedIfEmpty(COURSES, seedCourses);

// --- Real Firestore implementation --------------------------------------
async function firebaseGetCourses() {
  const { collection, getDocs } = await import("firebase/firestore");
  const snap = await getDocs(collection(db, COURSES));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function firebaseGetCourseById(id) {
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, COURSES, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function firebaseAddCourse(course) {
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
  const ref = await addDoc(collection(db, COURSES), { ...course, createdAt: serverTimestamp() });
  return { id: ref.id, ...course };
}

async function firebaseUpdateCourse(id, patch) {
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, COURSES, id), patch);
  return { id, ...patch };
}

async function firebaseDeleteCourse(id) {
  const { doc, deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, COURSES, id));
  return true;
}

// --- Demo implementation --------------------------------------------------
const mockGetCourses = () => local.withLatency(() => local.getAll(COURSES));
const mockGetCourseById = (id) => local.withLatency(() => local.getById(COURSES, id));
const mockAddCourse = (course) =>
  local.withLatency(() =>
    local.add(COURSES, {
      rating: 0,
      reviewCount: 0,
      enrollCount: 0,
      modules: [],
      ...course,
    })
  );
const mockUpdateCourse = (id, patch) => local.withLatency(() => local.update(COURSES, id, patch));
const mockDeleteCourse = (id) => local.withLatency(() => local.remove(COURSES, id));

// --- Public API -------------------------------------------------------------
export const getCourses = isFirebaseConfigured ? firebaseGetCourses : mockGetCourses;
export const getCourseById = isFirebaseConfigured ? firebaseGetCourseById : mockGetCourseById;
export const addCourse = isFirebaseConfigured ? firebaseAddCourse : mockAddCourse;
export const updateCourse = isFirebaseConfigured ? firebaseUpdateCourse : mockUpdateCourse;
export const deleteCourse = isFirebaseConfigured ? firebaseDeleteCourse : mockDeleteCourse;

/** Client-side search / filter / sort — kept together since Courses
 * page needs to combine all three against the same in-memory list. */
export function filterAndSortCourses(courses, { search, category, difficulty, sort } = {}) {
  let result = [...courses];

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.technologies?.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (category && category !== "All") {
    result = result.filter((c) => c.category === category);
  }
  if (difficulty && difficulty !== "All") {
    result = result.filter((c) => c.difficulty === difficulty);
  }

  switch (sort) {
    case "rating":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "popular":
      result.sort((a, b) => (b.enrollCount || 0) - (a.enrollCount || 0));
      break;
    case "newest":
      result.sort((a, b) => (b.createdAt?.seconds || b.createdAt || 0) - (a.createdAt?.seconds || a.createdAt || 0));
      break;
    default:
      break;
  }
  return result;
}
