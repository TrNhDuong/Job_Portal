import client from "../api/client";

export const authService = {
  login: async (email, password) => {
    try {
      // Gọi API thật: http://localhost:5000/api/admin/login
      const response = await client.post("/api/admin/login", { email, password });
      return response.data; 
    } catch (error) {
      throw error;
    }
  }
};