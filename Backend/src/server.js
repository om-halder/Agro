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
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// ===== OPTIONS preflight middleware =====
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", allowedOrigins.join(","));
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
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
