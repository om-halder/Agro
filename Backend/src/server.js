import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cropRoutes from "./routes/cropRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";

// Production-optimized middleware
app.use( cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Remove console logs in production
if (NODE_ENV === "production") {
  console.log = () => {};
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/user", userRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection failed:", err));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
});