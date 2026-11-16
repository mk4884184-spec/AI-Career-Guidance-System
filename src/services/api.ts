import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to attach JWT bearer token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ai_career_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional auto-logout on expired token
    }
    const message = error.response?.data?.error || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);
