// frontend/src/context/AuthContext.jsx
// --- PHIÊN BẢN NÂNG CẤP (KHỚP VỚI LOGINFORM MỚI) ---
import React, { createContext, useState, useEffect, useContext } from "react";
import client from "../api/client"; // Đảm bảo đường dẫn này đúng

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  useEffect(() => {
    if (auth.token) {
      client.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      localStorage.setItem("token", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
    } else {
      delete client.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [auth.token]); // Chỉ chạy khi token thay đổi

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

  const setEmployerData = (data) => {
    setAuth(prevAuth => ({ 
        ...prevAuth, 
        employerData: data 
    }));
    localStorage.setItem("employerData", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, setEmployerData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};