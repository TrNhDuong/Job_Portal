// src/Frontend/src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import {
  Menu,
  UserRound,
  Users,
  Home,
  Briefcase,
  Wrench,
} from "lucide-react";
import logo from "../assets/logo.png";

const navItem = ({ isActive }) =>
  `inline-flex items-center gap-1.5 px-2 py-2 rounded-md text-[17px] font-semibold ${
    isActive ? "text-blue-600" : "text-gray-800 hover:text-blue-600"
  }`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-blue-100">
      <div className="mx-auto px-4 md:px-6 lg:px-10">
        <div className="h-20 md:h-22 flex items-center justify-between gap-3">
          
          {/* THAY ĐỔI 1: Sửa ml-2.5 -> ml-[30px] */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 ml-[30px]"
          >
            <img
              src={logo}
              alt="Inspire Leader"
              className="h-12 md:h-14 w-auto drop-shadow-sm"
            />
          </Link>

          {/* Nhóm tất cả các nút bên phải */}
          <div className="hidden md:flex items-center gap-5">
            {/* Menu chính */}
            <nav className="flex items-center gap-5">
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
            </nav>

            {/* Khu vực hành động */}
            <div className="flex items-center gap-4">
              
              {/* THAY ĐỔI 2: Sửa lỗi màu xanh */}
              {/* Bỏ "text-blue-600" và thay bằng "text-gray-800" */}
              <div className="inline-flex items-center gap-2 text-gray-800 font-semibold">
                <UserRound className="w-5 h-5" />
                <Link
                  to="/register"
                  /* Thêm "hover:text-blue-600" */
                  className="hover:underline hover:text-blue-600"
                  title="Đăng Kí"
                >
                  <span>Đăng Kí</span>
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/login"
                  /* Thêm "hover:text-blue-600" */
                  className="hover:underline hover:text-blue-600"
                  title="Đăng Nhập"
                >
                  <span>Đăng Nhập</span>
                   </Link>
              </div>

              <Link
                to="/employer"
                className="inline-flex items-center gap-2 text-gray-800 hover:text-blue-600 font-semibold"
                title="Nhà Tuyển Dụng"
              >
                <Users className="w-5 h-5" />
                <span>Nhà Tuyển Dụng</span>
              </Link>
            </div>
          </div>
          {/* Nút menu mobile (vẫn giữ nguyên) */}
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