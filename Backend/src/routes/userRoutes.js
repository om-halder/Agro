import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// All routes are protected
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;