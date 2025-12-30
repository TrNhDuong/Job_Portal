import client from "../api/client";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await client.post("/api/admin/login", {
        email,
        password
      });

      // ✅ LƯU TOKEN
      if (response.data?.success) {
        const token = response.data.data.token;
        localStorage.setItem("token", token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
