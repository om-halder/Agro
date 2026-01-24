import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
});

// Attach Firebase token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // saved from AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
