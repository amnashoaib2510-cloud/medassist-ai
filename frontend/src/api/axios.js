import axios from "axios";

// In local development, Vite proxies "/api" to localhost:5000 (see vite.config.js).
// In production (any hostname other than localhost), fall back to the deployed
// Render backend URL directly, so this works even if the VITE_API_URL env var
// isn't picked up at build time. You can still override it by setting
// VITE_API_URL in your hosting provider's environment variables.
const isLocalhost = window.location.hostname === "localhost";
const PROD_API_URL = "https://medassist-ai-backend-gi5z.onrender.com/api";

const baseURL = import.meta.env.VITE_API_URL || (isLocalhost ? "/api" : PROD_API_URL);

const api = axios.create({
  baseURL,
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;