// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Gemini
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// // This function talks to Gemini
// export async function analyzeCrop(crop, imageBase64) {
//   const prompt = `
// You are an expert agriculture specialist.

// Crop: ${crop}

// The farmer has uploaded an image of the crop disease.
// Analyze the disease and provide:
// 1. Disease name
// 2. Cause
// 3. Symptoms
// 4. Organic solution
// 5. Chemical solution
// 6. Prevention tips

// Be clear and farmer-friendly.
// `;

//   const result = await model.generateContent([
//     { text: prompt },
//     {
//       inlineData: {
//         mimeType: "image/jpeg",
//         data: imageBase64,
//       },
//     },
//   ]);

//   return result.response.text();
// }
