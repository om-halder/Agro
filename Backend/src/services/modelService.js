import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:5001";

/**
 * Call the Python ML model API to predict disease
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} cropName - Crop name
 * @returns {Promise<Object>} - {disease, confidence, full_classification}
 */
export async function predictDisease(imageBuffer, cropName) {
  try {
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    formData.append("image", blob, "image.jpg");
    formData.append("crop", cropName);

    const response = await axios.post(`${PYTHON_API_URL}/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.data.success) {
      return {
        success: true,
        disease: response.data.disease,
        confidence: response.data.confidence,
        full_classification: response.data.full_classification,
      };
    } else {
      return {
        success: false,
        error: "Prediction failed",
      };
    }
  } catch (error) {
    console.error("Model prediction error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get available crops and diseases from model
 * @returns {Promise<Object>} - {crops, total_crops, total_classes}
 */
export async function getAvailableCrops() {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/crops`, {
      timeout: 5000,
    });

    if (response.data.success) {
      return {
        success: true,
        crops: response.data.crops,
        total_crops: response.data.total_crops,
        total_classes: response.data.total_classes,
      };
    }
  } catch (error) {
    console.error("Error fetching crops:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Health check for Python API
 * @returns {Promise<boolean>}
 */
export async function checkModelHealth() {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/health`, {
      timeout: 5000,
    });
    return response.data.model_loaded === true;
  } catch (error) {
    console.error("Model health check failed:", error.message);
    return false;
  }
}
