// src/api/auth.api.js
import api from "./axios";

// Register User
export const registerUser = async (userData) => {
  const response = await api.post("/api/register", userData);
  return response.data;
};

// Login User
export const loginUser = async (userData) => {
  const response = await api.post("/api/login", userData);
  return response.data;
};

// Get Current User Profile
export const getUserProfile = async () => {
  const response = await api.get("/api/me");
  return response.data;
};

// NEW: Update User Profile (Username & Email)
export const updateUserProfile = async (userData) => {
  const response = await api.put("/api/me", userData);
  return response.data;
};

// Login admin
export const loginAdmin = async (userData) => {
  const response = await api.post("/api/admin/login", userData);
  return response.data;
};
