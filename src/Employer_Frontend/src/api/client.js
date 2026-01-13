// frontend/src/api/client.js
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

// --- THÊM BỘ ĐÁNH CHẶN (INTERCEPTOR) ĐỂ XỬ LÝ TOKEN HẾT HẠN ---

client.interceptors.response.use(
  // 1. Nếu response THÀNH CÔNG (status 2xx), chỉ cần trả về response
  (response) => {
    return response;
  },
  // 2. Nếu response THẤT BẠI (status 4xx, 5xx)
  async (error) => {
    
    // Kiểm tra xem có phải lỗi 401 (Unauthorized) hoặc 403 (Forbidden) không
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // Kiểm tra xem có phải lỗi "Access token expired" không
      if (error.response.data.message === "Access token expired") {
        
        console.error("Token hết hạn! Tự động đăng xuất.");
        
        // Xóa token (chìa khóa) cũ khỏi bộ nhớ
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Xóa token khỏi header của client (cho các request tương lai)
        delete client.defaults.headers.common["Authorization"];

        // Ép người dùng quay về trang Login
        // (Chúng ta dùng window.location để refresh toàn bộ, xóa sạch state cũ)
        window.location.href = '/login'; 
      }
    }
    
    // Trả về lỗi để .catch() (trong Homepage) có thể xử lý
    return Promise.reject(error);
  }
);
// --- KẾT THÚC BỘ ĐÁNH CHẶN ---

export default client;