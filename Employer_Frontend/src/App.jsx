// frontend/src/App.jsx
// --- PHIÊN BẢN MỚI VỚI REACT-ROUTER-DOM ---
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

// Import các trang
import Homepage from './pages/Homepage.jsx';
import LoginPage from './pages/loginPage.jsx';     // File LoginForm.jsx của bạn
import RegisterPage from './pages/registerPage.jsx'; // File Register.jsx của bạn

// --- COMPONENT BẢO VỆ ---
// Component này kiểm tra user đã đăng nhập chưa
// Nếu chưa, nó sẽ điều hướng về /login
function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" replace />;
}
// ------------------------

export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Route 1: Trang Đăng nhập
        Nếu đã đăng nhập (có token), tự động chuyển đến Homepage
      */}
      <Route 
        path="/login" 
        element={auth.token ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* Route 2: Trang Đăng ký
        Nếu đã đăng nhập, tự động chuyển đến Homepage
      */}
      <Route 
        path="/register" 
        element={auth.token ? <Navigate to="/" replace /> : <RegisterPage />} 
      />

      {/* Route 3: Trang chủ (Homepage)
        Được bọc bởi <ProtectedRoute>
        Nếu chưa đăng nhập, sẽ bị đá về /login
      */}
      <Route
        path="/*" // Bắt mọi đường dẫn khác (bao gồm "/")
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}