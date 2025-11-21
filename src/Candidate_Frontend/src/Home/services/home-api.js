import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: false,
});

export const fetchFeaturedJobs = () => api.get("/api/post-job");
export const fetchFeaturedBrands = () => api.get("/api/employer/feature");

export const fetchJobs = (filters) => {
  const params = new URLSearchParams(filters);
  return api.get(`/api/post-job?${params.toString()}`);
};