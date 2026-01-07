import axios from "axios";

const client = axios.create({
  baseURL: "https://job-portal-la9s.onrender.com" ,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export default client;
