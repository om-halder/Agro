import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for Firebase users
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    profileImage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["farmer", "expert"],
      default: "farmer",
    },
    location: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);