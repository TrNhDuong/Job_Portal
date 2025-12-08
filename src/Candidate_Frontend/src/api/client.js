import axios from "axios";

const client = axios.create({
  baseURL: "https://jobportal-server-6g2n.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
