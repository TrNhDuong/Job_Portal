import axios from "axios";

// Thay đổi baseURL tùy theo server của bạn
const client = axios.create({
  baseURL: "http://localhost:8080", 
  headers: { "Content-Type": "application/json" },
});

export default client;