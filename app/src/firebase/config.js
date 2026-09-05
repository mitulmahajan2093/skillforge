import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Firebase config is read from Vite env vars (see .env.example).
 * If no API key is provided, the app runs in DEMO MODE: all
 * services/* files fall back to a localStorage-backed mock backend
 * with the same async function signatures, so every screen works
 * out of the box. Drop real Firebase project keys into .env.local
 * to switch the whole app over to live Firebase — no other code
 * changes required.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app, auth, db, storage, analytics;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Analytics needs a measurementId and browser support (it's a no-op in
  // any non-browser context and fails quietly if the browser blocks it,
  // e.g. via an ad blocker) — so it's loaded lazily and best-effort.
  if (firebaseConfig.measurementId) {
    import("firebase/analytics").then(({ getAnalytics, isSupported }) => {
      isSupported().then((supported) => {
        if (supported) analytics = getAnalytics(app);
      });
    });
  }
}

export { app, auth, db, storage, analytics };
