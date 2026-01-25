import express from "express";
import upload from "../middlewares/upload.js";
import { analyzeCropProblem, checkHealth } from "../controllers/cropController.js";

const router = express.Router();

router.post(
  "/analyze",
  upload.single("image"),
  analyzeCropProblem
);

router.get("/health", checkHealth);

export default router;