import axios from "axios";

const client = axios.create({
  baseURL: "https://job-portal-la9s.onrender.com" || "http://localhost:8500",
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
