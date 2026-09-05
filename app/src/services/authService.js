import { isFirebaseConfigured, auth, db } from "../firebase/config";
import * as local from "./localStore";

const USERS = "users";

seedDemoAdmin();

function seedDemoAdmin() {
  local.seedIfEmpty(USERS, [
    {
      id: "demo_admin",
      name: "Admin Demo",
      email: "admin@skillforge.dev",
      password: "admin123",
      role: "admin",
      avatar: "",
      createdAt: Date.now(),
    },
  ]);
}

// --- Real Firebase implementation --------------------------------------
async function firebaseRegister({ name, email, password }) {
  const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
  const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    role: "student",
    avatar: "",
    createdAt: serverTimestamp(),
  });
  return { id: cred.user.uid, name, email, role: "student" };
}

async function firebaseLogin({ email, password }) {
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  const { doc, getDoc } = await import("firebase/firestore");
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  return snap.exists() ? { id: cred.user.uid, ...snap.data() } : { id: cred.user.uid, email, role: "student" };
}

async function firebaseLogout() {
  const { signOut } = await import("firebase/auth");
  return signOut(auth);
}

async function firebaseResetPassword(email) {
  const { sendPasswordResetEmail } = await import("firebase/auth");
  return sendPasswordResetEmail(auth, email);
}

function firebaseOnAuthChange(callback) {
  let unsubscribe = () => {};
  import("firebase/auth").then(({ onAuthStateChanged }) => {
    unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) return callback(null);
      const { doc, getDoc } = await import("firebase/firestore");
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      callback(snap.exists() ? { id: fbUser.uid, ...snap.data() } : { id: fbUser.uid, email: fbUser.email, role: "student" });
    });
  });
  return () => unsubscribe();
}

// --- Demo (localStorage) implementation ---------------------------------
const SESSION_KEY = "skillforge:session";

async function mockRegister({ name, email, password }) {
  const users = await local.getAll(USERS);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user = await local.add(USERS, {
    name,
    email,
    password, // demo only — never store plaintext passwords in a real backend
    role: "student",
    avatar: "",
    createdAt: Date.now(),
  });
  setSession(user.id);
  return sanitize(user);
}

async function mockLogin({ email, password }) {
  const users = await local.getAll(USERS);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.");
  }
  setSession(user.id);
  return sanitize(user);
}

async function mockLogout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("skillforge-auth-change"));
}

function setSession(id) {
  localStorage.setItem(SESSION_KEY, id);
  window.dispatchEvent(new Event("skillforge-auth-change"));
}

async function mockResetPassword(email) {
  const users = await local.getAll(USERS);
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) throw new Error("No account found with this email.");
  // In demo mode we just simulate success — a real backend would email a reset link.
  return true;
}

function mockOnAuthChange(callback) {
  const check = async () => {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return callback(null);
    const user = await local.getById(USERS, id);
    callback(user ? sanitize(user) : null);
  };
  check();
  window.addEventListener("storage", check);
  window.addEventListener("skillforge-auth-change", check);
  return () => {
    window.removeEventListener("storage", check);
    window.removeEventListener("skillforge-auth-change", check);
  };
}

function sanitize(user) {
  const { password: _password, ...rest } = user;
  return rest;
}

// --- Public API -----------------------------------------------------------
export const register = isFirebaseConfigured ? firebaseRegister : mockRegister;
export const login = isFirebaseConfigured ? firebaseLogin : mockLogin;
export const logout = isFirebaseConfigured ? firebaseLogout : mockLogout;
export const resetPassword = isFirebaseConfigured ? firebaseResetPassword : mockResetPassword;
export const onAuthChange = isFirebaseConfigured ? firebaseOnAuthChange : mockOnAuthChange;

export async function getAllUsers() {
  if (isFirebaseConfigured) {
    const { collection, getDocs } = await import("firebase/firestore");
    const snap = await getDocs(collection(db, USERS));
    return snap.docs.map((d) => sanitize({ id: d.id, ...d.data() }));
  }
  const users = await local.getAll(USERS);
  return users.map(sanitize);
}

export async function updateUserProfile(userId, patch) {
  if (isFirebaseConfigured) {
    const { doc, updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "users", userId), patch);
    return { id: userId, ...patch };
  }
  return local.update(USERS, userId, patch).then(sanitize);
}
