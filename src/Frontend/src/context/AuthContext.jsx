// src/context/AuthContext.jsx

import React, { createContext, useContext, useState } from "react";

// Tạo Context
const AuthContext = createContext(null);

// Tạo "Nhà cung cấp" (Provider)
export const AuthProvider = ({ children }) => {
  // Lấy dữ liệu user từ localStorage nếu có (để giữ đăng nhập khi F5)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Hàm đăng nhập
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Tạo một hook tùy chỉnh (useAuth) để dễ dàng truy cập
export const useAuth = () => {
  return useContext(AuthContext);
};