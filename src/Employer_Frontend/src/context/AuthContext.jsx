// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import client from "../api/client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    employerData: JSON.parse(localStorage.getItem("employerData")) || null,
    //THANH TOÁN
    points: parseInt(localStorage.getItem("points")) || 100,
  });

  // Lưu token & user vào localStorage
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
  }, [auth.token]);

  //THANH TOÁN LƯU VÀO LOCALSTORAGE
  useEffect(() => {
    if (auth.points !== undefined) {
      localStorage.setItem("points", auth.points);
    }
  }, [auth.points]);

  const login = (email) => {
    setAuth(prev => ({
      ...prev,
      email: email
    }));
  };

  const setMail = (email) => {
    setAuth(prevAuth => ({
      ...prevAuth,
      email: email
    }));
  };

  const logout = () => {
    setAuth({ token: null, user: null, employerData: null });
    localStorage.removeItem("employerData");
  };

  // --- FIXED: Luôn tạo NEW OBJECT ---
  const setEmployerData = (data) => {
    setAuth(prev => ({
      ...prev,
      employerData: {
        ...data
      }
    }));
    localStorage.setItem("employerData", JSON.stringify(data));
  };

  // --- FIXED: Tạo lại STATE mới (NO MUTATION) ---
  const updateEmployerWithData = async (updatedData) => {
    setAuth(prev => {
      const newEmployer = {
        ...prev.employerData,
        data: {
          ...prev.employerData?.data,
          ...updatedData
        }
      };

      // Lưu vào localStorage
      localStorage.setItem("employerData", JSON.stringify(newEmployer));

      return {
        ...prev,
        employerData: newEmployer
      };
    });
  };

  // Fetch lại từ backend
  const updateData = async () => {
    const email = auth?.employerData?.data?.email;
    if (!email) return false;

    const result = await client.get(`api/employer?email=${email}`);
    if (result.data.success) {
      console.log(result.data);
      setEmployerData(result.data);
      return true;
    } else {
      return false;
    }
  };

  const getEmployerData = () => {
    return auth.employerData;
  };

  //THANH TOÁN
  const handleTransaction = (amount, type = "add") => {
    setAuth((prev) => {
      const newPoints = type === "add" ? prev.points + amount : prev.points - amount;
      return { ...prev, points: newPoints };
    });
    return true; 
  };

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      logout,
      setEmployerData,
      updateEmployerWithData,
      updateData,
      getEmployerData,
      setMail,
      //THANH TOÁN
      handleTransaction
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
