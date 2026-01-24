import admin from "firebase-admin";
import serviceAccount from "../../firebaseAdminKey.json" assert { type: "json" };

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to verify Firebase ID token
export const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // contains uid, email, etc.
  } catch (err) {
    throw new Error("Invalid Firebase token");
  }
};
