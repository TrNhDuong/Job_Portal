import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiChartPie, HiUsers, HiBriefcase, HiLogout, HiShieldCheck, HiCog, HiDesktopComputer, HiCreditCard } from "react-icons/hi";
import '../styles/AdminLayout.css'; // Style riêng cho layout này
import logoImage from '../assets/logo.png'; 

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tổng quan', icon: <HiChartPie /> },
    { path: '/admin/users', label: 'Người dùng', icon: <HiUsers /> },
    { path: '/admin/jobs', label: 'Tin tuyển dụng', icon: <HiBriefcase /> },
    { path: '/admin/wallet', label: 'Quản lý Ví', icon: <HiCreditCard /> },
    { path: '/admin/monitor', label: 'Quản lý nền tảng', icon: <HiDesktopComputer /> },
    { path: '/admin/settings', label: 'Cài đặt', icon: <HiCog /> },
  ];

  const handleLogout = () => {
    // Xóa dấu hiệu đã login
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminName");
    // Chuyển về login
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src={logoImage} alt="Logo" className="sidebar-logo" />
          <span className="sidebar-brand">InspireLeader</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item logout" onClick={handleLogout}> 
            <span className="nav-icon"><HiLogout /></span>
            <span className="nav-label">Đăng xuất</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* HEADER TRÊN CÙNG */}
        <header className="admin-header">
            <h2 className="page-title">
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <div className="admin-profile">
                <span className="admin-name">Administrator</span>
                <div className="admin-avatar"><HiShieldCheck /></div>
            </div>
        </header>

        {/* NỘI DUNG THAY ĐỔI (DASHBOARD, USERS, ETC.) */}
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}