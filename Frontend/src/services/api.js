import axios from "axios";
import { auth } from "../auth/firebase"; // adjust path

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000, // ⬅️ VERY IMPORTANT (30 seconds)
});

// Attach Firebase token dynamically
API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(); // 🔥 always valid
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
