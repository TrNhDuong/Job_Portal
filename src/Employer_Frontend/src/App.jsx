import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

import Homepage from './pages/Homepage.jsx';
import LoginPage from './pages/employerLogin.jsx';     
import RegisterPage from './pages/employerRegister.jsx'; 

import { Toaster } from 'react-hot-toast';


export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <>
    <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          // Tùy chỉnh font chữ cho đồng bộ với web
          style: {
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '0.95rem',
          },
          // Chỉnh thời gian hiện mặc định
          duration: 3000, 
        }}
      />
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route 
        path="/login" 
        element={<LoginPage />} 
      />

      <Route 
        path="/register" 
        element={<RegisterPage />} 
      />

      <Route
        path="/homepage"
        element={
            <Homepage />
        }
      />

    </Routes>
    </>
  );
}