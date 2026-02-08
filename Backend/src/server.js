 // src/server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import admin from "firebase-admin";

import cropRoutes from "./routes/cropRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";

// ===== Firebase Admin Initialization (Safe) =====
const firebaseCredentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
} else {
  admin.app(); // reuse existing app if already initialized
}

// ===== CORS Configuration =====
// Support comma-separated FRONTEND_URL env (e.g. "https://app.example.com,http://localhost:5173")
const frontendEnv = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = frontendEnv.split(",").map((s) => s.trim()).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, server-to-server) with no origin
    if (!origin) return callback(null, true);
    // Allow when origin is in list or wildcard '*' present
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ===== OPTIONS preflight handler =====
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes("*") || allowedOrigins.includes(origin))) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  // No matching origin - respond with 204 No Content
  return res.sendStatus(204);
});

// ===== Body Parser =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ===== Remove console logs in production =====
if (NODE_ENV === "production") console.log = () => {};

// ===== Firebase JWT Authentication Middleware =====
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // attach Firebase user info
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/user", authenticate, userRoutes); // protected routes

// Example protected profile route
app.get("/api/user/profile", authenticate, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});

// ===== Health Check =====
app.get("/", (req, res) => res.send("Backend is running 🚀"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err));

// ===== Start Server =====
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// ===== Handle Unhandled Promise Rejections =====
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});
