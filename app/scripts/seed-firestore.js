#!/usr/bin/env node
/**
 * Seeds your live Firebase project's Firestore with the same sample
 * courses/reviews used in demo mode, and (optionally) creates a real
 * admin account so you have somewhere to sign in and manage the catalog
 * from the Admin Dashboard.
 *
 * Uses the Firebase Admin SDK (a service account, not your app's normal
 * client config) specifically so it bypasses firestore.rules — the client
 * SDK would be rejected, since only admins can write to /courses and no
 * admin exists yet on a fresh project.
 *
 * ---------------------------------------------------------------------
 * SETUP (one-time)
 * ---------------------------------------------------------------------
 * 1. Firebase console → Project settings → Service accounts →
 *    "Generate new private key". Save the downloaded JSON as
 *    app/serviceAccountKey.json (already gitignored — never commit it).
 *
 * 2. Make sure Firestore is enabled (console → Build → Firestore Database
 *    → Create database) — a brand-new project doesn't have one yet.
 *
 * ---------------------------------------------------------------------
 * USAGE
 * ---------------------------------------------------------------------
 *   node scripts/seed-firestore.js
 *     → seeds courses + reviews only
 *
 *   node scripts/seed-firestore.js --create-admin --admin-email=you@example.com --admin-password=SomethingStrong123
 *     → also creates a real Firebase Auth user with that email/password
 *       and a matching users/{uid} Firestore doc with role: "admin"
 *
 *   node scripts/seed-firestore.js --key=./path/to/other-key.json
 *     → use a service account key at a custom path
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { seedCourses, seedReviews } from "../src/services/mockData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getArg(name) {
  const match = process.argv.find((a) => a.startsWith(`--${name}=`));
  return match ? match.split("=").slice(1).join("=") : null;
}
function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

const keyPath = resolve(__dirname, "..", getArg("key") || "serviceAccountKey.json");

if (!existsSync(keyPath)) {
  console.error(`\n❌ Service account key not found at: ${keyPath}`);
  console.error(
    "   Download one from Firebase console → Project settings → Service accounts →\n" +
      "   Generate new private key, save it as app/serviceAccountKey.json, and re-run.\n"
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);
const auth = getAuth(app);

async function seedCoursesCollection() {
  console.log(`\nSeeding ${seedCourses.length} courses…`);
  const batch = db.batch();
  for (const course of seedCourses) {
    const ref = db.collection("courses").doc(course.id);
    batch.set(ref, course, { merge: true });
  }
  await batch.commit();
  console.log("✅ Courses seeded.");
}

async function seedReviewsCollection() {
  console.log(`\nSeeding ${seedReviews.length} reviews…`);
  const batch = db.batch();
  for (const review of seedReviews) {
    const ref = db.collection("reviews").doc(review.id);
    batch.set(ref, review, { merge: true });
  }
  await batch.commit();
  console.log("✅ Reviews seeded.");
}

async function createAdminAccount() {
  const email = getArg("admin-email");
  const password = getArg("admin-password");

  if (!email || !password) {
    console.error(
      "\n❌ --create-admin requires --admin-email=you@example.com --admin-password=SomethingStrong123"
    );
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("\n❌ Firebase requires passwords to be at least 6 characters.");
    process.exit(1);
  }

  console.log(`\nCreating admin account for ${email}…`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log("   Auth user already exists — reusing it.");
  } catch {
    userRecord = await auth.createUser({ email, password, displayName: "Admin" });
    console.log("   Auth user created.");
  }

  await db.collection("users").doc(userRecord.uid).set(
    {
      name: userRecord.displayName || "Admin",
      email,
      role: "admin",
      avatar: "",
      createdAt: new Date(),
    },
    { merge: true }
  );

  console.log(`✅ ${email} is now an admin. Log in at /login with that email/password.`);
}

async function main() {
  await seedCoursesCollection();
  await seedReviewsCollection();
  if (hasFlag("create-admin")) {
    await createAdminAccount();
  }
  console.log("\nDone. 🎉\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seeding failed:\n", err);
  process.exit(1);
});
