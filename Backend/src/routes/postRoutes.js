import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getPosts, createPost } from "../controllers/postController.js";

const router = express.Router();

// Get posts (protected)
router.get("/", protect, getPosts);

// Create post (protected)
router.post("/", protect, createPost);

export default router;