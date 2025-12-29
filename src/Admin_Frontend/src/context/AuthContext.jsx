import React, { createContext, useState, useEffect, useContext } from "react";
import client from "../api/client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Khởi tạo state: Chỉ lấy adminToken và adminUser
  const [auth, setAuth] = useState({
    token: localStorage.getItem("adminToken") || null,
    user: JSON.parse(localStorage.getItem("adminUser")) || null,
  });

  // 2. Đồng bộ Token với Axios & LocalStorage
  useEffect(() => {
    if (auth.token) {
      // Gán token vào header mặc định cho mọi request sau này
      client.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      localStorage.setItem("adminToken", auth.token);
      localStorage.setItem("adminUser", JSON.stringify(auth.user));
    } else {
      delete client.defaults.headers.common["Authorization"];
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }
  }, [auth.token, auth.user]);

  // 3. Hàm Login: Chỉ nhiệm vụ cập nhật State (Logic gọi API nằm ở UI/Service)
  const login = (token, userInfo) => {
    setAuth({
      token: token,
      user: userInfo,
    });
  };

  // 4. Hàm Logout: Xóa sạch dữ liệu
  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    // Chuyển hướng hoặc reload trang nếu cần thiết để reset cache
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);