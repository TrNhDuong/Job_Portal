// src/components/DashboardSidebar.jsx

import React, { useState, useEffect } from 'react';
// Sửa: Import thêm useLocation
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Sửa: Import thêm ChevronDown
import { User, FileText, Settings, Briefcase, Bell, ChevronDown } from 'lucide-react';

// Hàm style link con (cho menu xổ xuống)
const subNavLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 pl-11
   ${ isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'font-medium' }`;

// Hàm style link cha (giữ nguyên)
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
    isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'font-medium'
  }`;

export default function DashboardSidebar() {
  const { user } = useAuth();
  const location = useLocation(); // Lấy vị trí hiện tại

  // Kiểm tra xem có đang ở trang con của 'settings' không
  const isSettingsActive = location.pathname.startsWith('/dashboard/settings');

  // State để quản lý menu (mặc định mở nếu đang ở trang con)
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  // Tự động mở menu nếu URL thay đổi (ví dụ: F5)
  useEffect(() => {
    setIsSettingsOpen(isSettingsActive);
  }, [isSettingsActive]);

  if (!user) return null; 

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      
    	{/* ... (Phần thông tin User giữ nguyên) ... */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <div className="font-bold text-lg uppercase">{user.name}</div>
          <div className="text-sm text-gray-500">Tài khoản chưa xác thực</div>
          <div className="text-sm text-gray-500 truncate">{user.email}</div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-1">
        
    	{/* ... (Nhóm 1 và 2 giữ nguyên) ... */}
        <div className="text-sm font-bold text-gray-900 px-3 mt-2 mb-1">Quản lý tìm việc</div>
        <NavLink to="/dashboard" end className={navLinkClass}>
          <Briefcase className="w-5 h-5" />
          Việc làm phù hợp
        </NavLink>
        
        <div className="text-sm font-bold text-gray-900 px-3 mt-4 mb-1">Quản lý CV & Cover letter</div>
        <NavLink to="/dashboard/my-cv" className={navLinkClass}>
          <FileText className="w-5 h-5" />
          CV của tôi
        </NavLink>

        {/* --- SỬA NHÓM 3: CÀI ĐẶT --- */}
      	<div className="text-sm font-bold text-gray-900 px-3 mt-4 mb-1">Cài đặt</div>
        
        {/* Biến NavLink thành Button để điều khiển 'onClick' */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100
            ${isSettingsActive ? 'font-semibold' : 'font-medium'}
          `}
        >
          <div className="flex items-center gap-3">
            <Settings className={`w-5 h-5 ${isSettingsActive ? 'text-blue-700' : ''}`} />
            <span>Cá nhân & Bảo mật</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Các link con (chỉ hiện khi isSettingsOpen = true) */}
        {isSettingsOpen && (
          <div className="flex flex-col gap-1 mt-1">
            <NavLink to="/dashboard/settings/profile" className={subNavLinkClass}>
              Thông tin cá nhân
            </NavLink>
            <NavLink to="/dashboard/settings/password" className={subNavLinkClass}>
              Thay đổi mật khẩu
            </NavLink>
            <NavLink to="/dashboard/settings/security" className={subNavLinkClass}>
              Cài đặt bảo mật
            </NavLink>
          </div>
        )}

        {/* Link Cài đặt email (vẫn giữ nguyên) */}
        <NavLink to="/dashboard/notifications" className={navLinkClass}>
          <Bell className="w-5 h-5" />
          Cài đặt email & thông báo
        </NavLink>

      </nav>
    </div>
  );
}