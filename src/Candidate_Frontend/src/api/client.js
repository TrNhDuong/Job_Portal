import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8500" || "https://jobportal-server-6g2n.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
