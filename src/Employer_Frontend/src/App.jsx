// frontend/src/App.jsx
// --- PHIÊN BẢN MỚI VỚI REACT-ROUTER-DOM ---
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

// Import các trang
import Homepage from './pages/Homepage.jsx';
import LoginPage from './pages/employerLogin.jsx';     // File LoginForm.jsx của bạn
import RegisterPage from './pages/employerRegister.jsx'; // File Register.jsx của bạn


function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" replace />;
}
// ------------------------

export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>

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