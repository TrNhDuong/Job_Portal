import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9981" ,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
