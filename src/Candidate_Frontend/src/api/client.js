import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8500" || "https://job-portal-la9s.onrender.com" ,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
