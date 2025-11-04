// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import {
  Menu,
  User, // Dùng User
  Users,
  Home,
  Briefcase,
  Wrench,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx"; // Import Auth

const navItem = ({ isActive }) =>
  `inline-flex items-center gap-1.5 px-2 py-2 rounded-md text-[17px] font-semibold ${
    isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
  }`;

export default function Navbar() {
  // Lấy "user" và "logout" từ Context
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-blue-100">
      
      {/* Sửa: Thêm 'max-w-7xl' và 'pr-4' để căn lề đúng */}
      <div className="max-w-7xl mx-auto pl-4 md:pl-6 lg:pl-10 pr-4">
      
        <div className="h-20 md:h-22 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 shrink-0 ml-[30px]">
            <img
              src={logo}
              alt="Inspire Leader"
              className="h-12 md:h-14 w-auto drop-shadow-sm"
            />
          </Link>

          {/* Sửa: Gộp tất cả các nút làm 1 nhóm với "gap-3" */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* 1. Menu chính */}
            <NavLink to="/" className={navItem}>
              <Home className="w-5 h-5" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/jobs" className={navItem}>
              <Briefcase className="w-5 h-5" />
              <span>Job</span>
            </NavLink>
            <NavLink to="/tools" className={navItem}>
              <Wrench className="w-5 h-5" />
              <span>Tools</span>
            </NavLink>

            {/* 2. Logic Hiển thị */}
            {user ? (
              /* === KHI ĐÃ ĐĂNG NHẬP === */
              <>
                {/* Thêm <Link> trỏ đến Dashboard */}
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center gap-2 text-gray-800 font-semibold"
                  title="Quản lý tài khoản"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-6 h-6 p-1 bg-gray-200 rounded-full" />
                  )}
                  <span>{user.name || user.email}</span>
                </Link>

                <button
                  onClick={logout}
                  className="font-semibold text-red-500 hover:text-red-700 hover:underline"
                  title="Đăng xuất"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              /* === KHI CHƯA ĐĂNG NHẬP === */
              <>
                <div className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                  <User className="w-5 h-5" />
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `hover:underline ${isActive ? "text-blue-600" : "hover:text-blue-600"}`
                    }
                    title="Đăng Kí"
                  >
                    <span>Đăng Kí</span>
                  </NavLink>
                  <span className="text-gray-300">|</span>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `hover:underline ${isActive ? "text-blue-600" : "hover:text-blue-600"}`
                    }
                    title="Đăng Nhập"
                  >
                    <span>Đăng Nhập</span>
                  </NavLink>
                </div>

                <Link
                  to="/employer"
                  className="inline-flex items-center gap-2 text-gray-800 hover:text-blue-600 font-semibold"
                  title="Nhà Tuyển Dụng"
                >
                  <Users className="w-5 h-5" />
                  <span>Nhà Tuyển Dụng</span>
                </Link>
              </>
            )}
          </div>

          {/* Nút menu mobile */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}