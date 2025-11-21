import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

import Homepage from './pages/Homepage.jsx';
import LoginPage from './pages/employerLogin.jsx';     // File LoginForm.jsx của bạn
import RegisterPage from './pages/employerRegister.jsx'; // File Register.jsx của bạn



export default function App() {
  const { auth } = useContext(AuthContext);

  return (
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
  );
}