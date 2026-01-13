import axios from "axios";

const client = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://job-portal-la9s.onrender.com",
=======
  baseURL: "http://localhost:8080",
>>>>>>> PhuHieu
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
