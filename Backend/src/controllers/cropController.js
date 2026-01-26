import { predictDisease, checkModelHealth } from "../services/modelService.js";
import fs from "fs";
import path from "path";

// =============================
// Load crop-disease JSON data
// =============================
const dataPath = path.join(process.cwd(), "data", "crop_disease_data.json");
const cropDiseaseData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// =============================
// Helper: Get info from JSON
// =============================
function getDiseaseInfo(crop, disease) {
  if (cropDiseaseData[crop] && cropDiseaseData[crop][disease]) {
    return cropDiseaseData[crop][disease];
  } else {
    return {
      treatment: ["Consult local agricultural expert"],
      prevention: ["Maintain crop rotation and field hygiene"],
      organic_methods: ["Use neem oil spray or compost tea"]
    };
  }
}

// =============================
// Analyze crop problem endpoint
// =============================
export const analyzeCropProblem = async (req, res) => {
  try {
    const { crop } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!crop) {
      return res.status(400).json({ message: "Crop name is required" });
    }

    // Step 1: Get ML prediction
    console.log(` Predicting disease for ${crop}...`);
    const mlResult = await predictDisease(req.file.buffer, crop);

    if (!mlResult.success) {
      console.warn(" ML model failed:", mlResult.error);
      return res.status(500).json({
        message: "Disease detection failed",
        error: mlResult.error,
      });
    }

    console.log(` ML Prediction: ${mlResult.disease} (${mlResult.confidence}%)`);

    // Step 2: Lookup JSON data instead of OpenAI
    const diseaseData = getDiseaseInfo(crop, mlResult.disease);

    // Step 3: Combine results
    const finalResult = {
      crop,
      disease: mlResult.disease,
      confidence: mlResult.confidence,
      treatment: diseaseData.treatment || [],
      prevention: diseaseData.prevention || [],
      organic_methods: diseaseData.organic_methods || [],
    };

    console.log(`✅ Analysis complete!`);
    res.json(finalResult);
  } catch (error) {
    console.error("❌ Analyze error:", error.message);
    res.status(500).json({
      message: "Failed to analyze crop",
      error: error.message,
    });
  }
};

// =============================
// Health check endpoint
// =============================
export const checkHealth = async (req, res) => {
  try {
    const modelReady = await checkModelHealth();
    res.json({
      status: modelReady ? "ready" : "not_ready",
      model_loaded: modelReady,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};