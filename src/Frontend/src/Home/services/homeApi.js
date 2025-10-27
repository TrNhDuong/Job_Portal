import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: false,
});

export const fetchFeaturedJobs = () => api.get("/api/jobs/featured");
export const fetchFeaturedBrands = () => api.get("/api/brands/featured");
