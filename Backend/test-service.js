#!/usr/bin/env node
import { analyzeCropImage } from "./src/services/openaiVisionService.js";

console.log("\n🧪 Testing analyzeCropImage Function...\n");

try {
  const result = await analyzeCropImage(
    null,
    "Tomato",
    "Early Blight",
    92
  );

  console.log("\n✅ Function executed successfully!\n");
  console.log("📊 Result Summary:");
  console.log("   Crop:", result.crop);
  console.log("   Disease:", result.disease);
  console.log("   Confidence:", result.confidence + "%");
  console.log("   Severity:", result.severity);
  console.log("   Symptoms:", result.symptoms?.length || 0, "items");
  console.log("   Treatment:", result.treatment?.length || 0, "items");
  console.log("   Prevention:", result.prevention?.length || 0, "items");
  console.log("   Fungicides:", result.chemical_fungicides?.length || 0, "items");
  console.log("   Organic Methods:", result.organic_methods?.length || 0, "items");
  
  if (result.symptoms && result.symptoms[0] === "Unable to retrieve detailed analysis") {
    console.log("\n⚠️  WARNING: Fallback response returned (API call failed)");
    console.log("   This means the OpenAI API is not responding correctly");
  } else {
    console.log("\n✅ SUCCESS: OpenAI API is working correctly!");
  }
} catch (error) {
  console.error("\n❌ ERROR:", error.message);
  console.error("Full Error:", error);
}
