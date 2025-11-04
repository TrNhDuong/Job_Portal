// src/components/DashboardSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, FileText, Settings, Briefcase, Bell } from 'lucide-react'; // Import icons

// Đây là hàm giúp tô màu link đang được chọn
const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
    isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'font-medium'
  }`;

export default function DashboardSidebar() {
  const { user } = useAuth();

  if (!user) return null; // Nếu vì lý do gì đó user bị rỗng

  return (
    // Khung trắng chứa thông tin
    <div className="bg-white rounded-lg shadow-sm p-4">
      
      {/* Phần thông tin User (giống hình) */}
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
      
      {/* Phần Menu (dùng NavLink) */}
      <nav className="flex flex-col gap-1">
        
        {/* Nhóm 1: Quản lý tìm việc */}
        <div className="text-sm font-bold text-gray-900 px-3 mt-2 mb-1">Quản lý tìm việc</div>
        <NavLink to="/dashboard" end className={navLinkClass}>
          <Briefcase className="w-5 h-5" />
          Việc làm phù hợp
        </NavLink>
        {/* Bạn có thể thêm "Việc làm đã lưu"... */}

        {/* Nhóm 2: Quản lý CV */}
        <div className="text-sm font-bold text-gray-900 px-3 mt-4 mb-1">Quản lý CV & Cover letter</div>
        <NavLink to="/dashboard/my-cv" className={navLinkClass}>
          <FileText className="w-5 h-5" />
          CV của tôi
        </NavLink>
        {/* Bạn có thể thêm "Cover Letter của tôi"... */}

        {/* Nhóm 3: Cài đặt */}
        <div className="text-sm font-bold text-gray-900 px-3 mt-4 mb-1">Cài đặt</div>
        <NavLink to="/dashboard/settings" className={navLinkClass}>
          <Settings className="w-5 h-5" />
          Cá nhân & Bảo mật
        </NavLink>
        <NavLink to="/dashboard/notifications" className={navLinkClass}>
          <Bell className="w-5 h-5" />
          Cài đặt email & thông báo
        </NavLink>

      </nav>
    </div>
  );
}