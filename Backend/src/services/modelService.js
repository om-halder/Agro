import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// =============================
// CONFIG
// =============================
const ML_API_URL =
  process.env.ML_API_URL || process.env.PYTHON_API_URL || "http://localhost:5001";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const INITIAL_TIMEOUT = 60000; // 60s for cold starts
const NORMAL_TIMEOUT = 30000; // 30s for warm requests
const INFERENCE_TIMEOUT = 60000; // 60s max inference time

// =============================
// UTILITY: Retry Handler with Exponential Backoff
// =============================
async function retryWithBackoff(fn, retries = MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${retries}...`);
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      // Retry on server errors or network issues
      if (attempt < retries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.warn(`⚠️  Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// =============================
// UTILITY: Get Timeout Based on Context
// =============================
function getTimeout(isFirstRequest = false) {
  // Render free tier takes 40-50s to wake up, use longer timeout
  return isFirstRequest ? INFERENCE_TIMEOUT : NORMAL_TIMEOUT;
}

// =============================
// Predict Disease with Retry Logic
// =============================
export async function predictDisease(imageBuffer, cropName, isFirstRequest = false) {
  try {
    if (!imageBuffer || !cropName) {
      throw new Error("Image buffer or crop name missing");
    }

    const timeout = getTimeout(isFirstRequest);

    return await retryWithBackoff(async () => {
      const formData = new FormData();

      // Append image and crop to form data
      formData.append("image", imageBuffer, {
        filename: "image.jpg",
        contentType: "image/jpeg",
      });

      formData.append("crop", cropName);

      console.log(`📤 Sending prediction request to ${ML_API_URL}/predict (timeout: ${timeout}ms)`);

      const response = await axios.post(
        `${ML_API_URL}/predict`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: timeout,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log(`✅ Prediction successful: ${response.data?.disease || 'Unknown'}`);
      return response.data;
    });
  } catch (error) {
    console.error("❌ Model prediction error after retries:", error.message);

    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Disease detection failed. Please try again.",
      statusCode: error.response?.status,
    };
  }
}

// =============================
// Get Available Crops with Retry Logic
// =============================
export async function getAvailableCrops() {
  try {
    console.log(`📋 Fetching available crops from ${ML_API_URL}/crops`);

    return await retryWithBackoff(async () => {
      const response = await axios.get(
        `${ML_API_URL}/crops`,
        {
          timeout: NORMAL_TIMEOUT,
        }
      );

      console.log(`✅ Successfully fetched ${response.data?.count || 0} crops`);
      return response.data;
    });
  } catch (error) {
    console.error("❌ Error fetching crops:", error.message);
    return {
      success: false,
      error: error.message,
      crops: [], // Fallback empty array
    };
  }
}

// =============================
// Health Check with Retry Logic
// =============================
export async function checkModelHealth() {
  try {
    console.log(`❤️  Checking model health at ${ML_API_URL}/health`);

    const response = await retryWithBackoff(async () => {
      return await axios.get(
        `${ML_API_URL}/health`,
        {
          timeout: NORMAL_TIMEOUT,
        }
      );
    });

    const isHealthy = response.data?.model_loaded === true;
    console.log(`${isHealthy ? "✅" : "❌"} Model health: ${isHealthy ? "Healthy" : "Unhealthy"}`);
    return isHealthy;
  } catch (error) {
    console.error("❌ Model health check failed:", error.message);
    return false;
  }
}

// =============================
// Get Model Info
// =============================
export async function getModelInfo() {
  try {
    console.log(`ℹ️  Fetching model info from ${ML_API_URL}/info`);

    const response = await retryWithBackoff(async () => {
      return await axios.get(
        `${ML_API_URL}/info`,
        {
          timeout: NORMAL_TIMEOUT,
        }
      );
    });

    console.log(`✅ Model info fetched successfully`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching model info:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
