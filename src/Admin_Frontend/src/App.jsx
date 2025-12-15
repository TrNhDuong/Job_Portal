import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import các trang
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import JobList from './pages/JobList';
import AdminMonitor from './pages/AdminMonitor';
import Setting from './pages/Setting'; 

// --- HÀM BẢO VỆ ĐƠN GIẢN (Kiểu Employer nâng cấp nhẹ) ---
const SimpleAuthGuard = () => {
  // Chỉ kiểm tra xem trong LocalStorage có biến này không
  const isLogin = localStorage.getItem("adminLoggedIn");
  
  return isLogin ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Route Login */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Mặc định vào gốc -> Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Khu vực Admin (Được bảo vệ bởi SimpleAuthGuard) */}
      <Route element={<SimpleAuthGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="jobs" element={<JobList />} />
            <Route path="monitor" element={<AdminMonitor />} />
            <Route path="settings" element={<Setting isVisible={true} onClose={() => {}} />} />
        </Route>
      </Route>

      {/* Route lạ -> Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;