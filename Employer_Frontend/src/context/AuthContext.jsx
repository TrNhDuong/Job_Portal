// frontend/src/context/AuthContext.jsx
// --- PHIÊN BẢN NÂNG CẤP (KHỚP VỚI LOGINFORM MỚI) ---
import React, { createContext, useState, useEffect, useContext } from "react";
// Import file client.js "xịn" của bạn
import client from "../api/client"; // Đảm bảo đường dẫn này đúng

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  // Tự động thêm Token vào header của MỌI request qua 'client'
  useEffect(() => {
    if (auth.token) {
      // Sửa đổi 'client' instance
      client.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      localStorage.setItem("token", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
    } else {
      delete client.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [auth.token]); // Chỉ chạy khi token thay đổi

  // Hàm Đăng nhập (MỚI):
  // Chỉ nhận data và set state (vì LoginForm tự gọi API)
  const login = (token, user) => {
    setAuth({
      token: token,
      user: user,
    });
  };

  // Hàm Đăng xuất (như cũ)
  const logout = () => {
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh (để LoginForm.jsx có thể dùng useAuth())
export const useAuth = () => {
  return useContext(AuthContext);
};