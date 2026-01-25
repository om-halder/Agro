import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },   // Firebase UID of sender
    receiverId: { type: String, required: true }, // Firebase UID of receiver
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
