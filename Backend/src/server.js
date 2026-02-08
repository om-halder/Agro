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


// ===== Firebase Admin Initialization =====
const firebaseCredentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
}


// ===== CORS Configuration (FINAL) =====

// Allow multiple origins from env (comma separated)
const allowedOrigins = [
  "http://localhost:5173",
  "https://agro-connect-f2eea.web.app",
  "https://agro-connect-f2eea.firebaseapp.com",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Handle preflight manually (Express v5 safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(200);
  }
  next();
});


// ===== Body Parser =====
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// ===== Silence logs in production =====
if (NODE_ENV === "production") console.log = () => {};


// ===== Firebase JWT Middleware =====
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};


// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/user", authenticate, userRoutes);

app.get("/api/user/profile", authenticate, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});


// ===== Health =====
app.get("/", (req, res) => res.send("Backend is running 🚀"));
app.get("/health", (req, res) => res.json({ status: "ok" }));


// ===== MongoDB =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err));


// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// ===== Global Error =====
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});
