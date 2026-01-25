import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

console.log("🧪 Testing OpenAI Connection...\n");
console.log("📋 API Key (first 20 chars):", process.env.OPENAI_API_KEY?.substring(0, 20) + "...");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log("\n⏳ Sending test request to OpenAI (gpt-4-turbo)...\n");

    const response = await openai.messages.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: `You are an expert agricultural pathologist. Provide comprehensive farming advice for the detected disease.

CROP: Tomato
DETECTED DISEASE: Early Blight
DETECTION CONFIDENCE: 92%

Based on this disease diagnosis, provide detailed, actionable information for farmers.

IMPORTANT: Respond ONLY with valid JSON (no other text).

JSON FORMAT - Return EXACTLY this structure:
{
  "crop": "Tomato",
  "disease": "Early Blight",
  "confidence": 92,
  "severity": "High",
  "symptoms": ["symptom1", "symptom2"],
  "conditions_favoring": ["High humidity"],
  "affected_growth_stages": ["Flowering", "Fruiting"],
  "treatment": ["Apply fungicide"],
  "prevention": ["Remove infected leaves"],
  "treatment_timing": "As soon as symptoms appear",
  "cure_duration": "7-14 days",
  "resistant_varieties": ["Variety1"],
  "estimated_yield_loss": "30%",
  "chemical_fungicides": ["Fungicide1"],
  "organic_methods": ["Neem oil spray"],
  "monitoring_tips": ["Check leaves daily"],
  "when_to_call_expert": "If spread continues"
}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const raw = response.choices[0].message.content;
    console.log("✅ OpenAI Response received!\n");
    
    try {
      const parsed = JSON.parse(raw);
      console.log("✅ JSON parsed successfully!\n");
      console.log("📊 Response Preview:");
      console.log("   Disease:", parsed.disease);
      console.log("   Confidence:", parsed.confidence + "%");
      console.log("   Severity:", parsed.severity);
      console.log("   Symptoms:", parsed.symptoms?.length || 0, "items");
      console.log("   Treatment:", parsed.treatment?.length || 0, "items");
      console.log("\n✅ OPENAI CONNECTION WORKING!");
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON response");
      console.error("Response:", raw.substring(0, 200));
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    if (error.status === 401) {
      console.error("   → Check your API key in .env");
    } else if (error.status === 404) {
      console.error("   → The gpt-4-turbo model might not be available in your account");
      console.error("   → Try switching to: gpt-3.5-turbo or another available model");
    } else if (error.status === 429) {
      console.error("   → Rate limit reached");
    }
  }
}

testOpenAI();
