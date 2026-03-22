// src/api/axios.js
import axios from "axios";

// Use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Create a specific axios instance for our API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Automatically attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Handle global errors (optional but recommended)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: If 401 Unauthorized, logout user
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;