import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
