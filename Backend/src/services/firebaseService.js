import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Initialize Firebase Admin (singleton)
if (!admin.apps.length) {
  // Try to use env vars first
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_PROJECT_ID !== "your_project_id") {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn("Firebase environment variables not set. Trying to load from JSON file.");
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      const serviceAccountPath = path.join(__dirname, "../../firebaseAdminKey.json");
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (err) {
      console.error("Failed to initialize Firebase:", err.message);
    }
  }
}

// Verify Firebase ID token
export const verifyFirebaseToken = async (token) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    throw new Error("Invalid Firebase token");
  }
};