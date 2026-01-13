import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://job-portal-la9s.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
