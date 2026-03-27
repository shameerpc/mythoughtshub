import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ fixed key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // ✅ let browser set multipart boundary
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken"); // ✅ fixed key
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      console.log("🚨 Session expired or invalid token.");
    }
    return Promise.reject(error);
  }
);

export default api;