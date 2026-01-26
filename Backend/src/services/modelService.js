import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// =============================
// CONFIG
// =============================
const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "http://localhost:5001";

// =============================
// Predict Disease
// =============================
export async function predictDisease(imageBuffer, cropName) {
  try {
    if (!imageBuffer || !cropName) {
      throw new Error("Image buffer or crop name missing");
    }

    const formData = new FormData();

    // ✅ NODE-CORRECT multipart upload
    formData.append("image", imageBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg",
    });

    formData.append("crop", cropName);

    const response = await axios.post(
      `${PYTHON_API_URL}/predict`,
      formData,
      {
        headers: {
          ...formData.getHeaders(), // 🔥 REQUIRED
        },
        timeout: 30000, // handle cold starts
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Model prediction error:", error.message);

    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Prediction failed",
    };
  }
}

// =============================
// Get Available Crops
// =============================
export async function getAvailableCrops() {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/crops`, {
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching crops:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// =============================
// Health Check
// =============================
export async function checkModelHealth() {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/health`, {
      timeout: 30000,
    });

    return response.data?.model_loaded === true;
  } catch (error) {
    console.error("❌ Model health check failed:", error.message);
    return false;
  }
}
