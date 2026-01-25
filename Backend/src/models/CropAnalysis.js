import mongoose from "mongoose";

const cropAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional for now
    },
    crop: String,
    imageUrl: String,
    disease: String,
    confidence: Number,
    symptoms: [String],
    treatment: [String],
    prevention: [String],
  },
  { timestamps: true }
);

export default mongoose.model("CropAnalysis", cropAnalysisSchema);
