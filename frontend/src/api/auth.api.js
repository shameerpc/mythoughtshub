// src/api/auth.api.js
import api from "./axios";

// Register User
export const registerUser = async (userData) => {
  try {
    // We don't need the full baseURL here because it's set in axios.js
    const response = await api.post("/api/register", userData);
    return response.data;
  } catch (error) {
    // Throw the error so the React Component (Register.jsx) can catch it
    throw error;
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/api/login", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// NEW: Get Current User Profile
export const getUserProfile = async () => {
  const response = await api.get("/api/me"); // Ensure your backend has this endpoint
  return response.data;
};