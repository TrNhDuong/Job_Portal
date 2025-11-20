// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import {
  Menu,
  User,
  Users,
  Home,
  Briefcase,
  Wrench,
  ChevronRight,
  Sparkles
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth(); // Đã loại bỏ 'logout' khỏi đây

  // --- STYLES ---
  // Style cho Menu Links (Giữa)
  const navItemStyle = ({ isActive }) =>
    `relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300
     ${
       isActive
         ? "text-indigo-600 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-100"
         : "text-slate-500 hover:text-indigo-600 hover:bg-white"
     }`;

  return (
    // HEADER: Tăng chiều cao (h-24 ~ 96px) và hiệu ứng kính mờ xịn (backdrop-blur-xl)
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="h-24 flex items-center justify-between">
          
          {/* 1. LOGO AREA */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
               {/* Hiệu ứng glow sau logo */}
               <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <img
                src={logo}
                alt="Inspire Leader"
                className="relative h-14 w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* 2. MAIN NAVIGATION (CENTER) */}
          {/* Ẩn trên mobile, hiện trên md. Dùng background nhẹ cho cụm menu */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 bg-slate-50/50 border border-slate-100 rounded-full">
            <NavLink to="/" className={navItemStyle}>
              <Home className="w-4 h-4" strokeWidth={2.5} />
              <span>Trang chủ</span>
            </NavLink>
            <NavLink to="/jobs" className={navItemStyle}>
              <Briefcase className="w-4 h-4" strokeWidth={2.5} />
              <span>Việc làm</span>
            </NavLink>
            <NavLink to="/tools" className={navItemStyle}>
              <Wrench className="w-4 h-4" strokeWidth={2.5} />
              <span>Công cụ</span>
            </NavLink>
          </nav>

          {/* 3. AUTH ACTION AREA (RIGHT) */}
          <div className="flex items-center gap-5">
            
            {/* Link "Nhà Tuyển Dụng" - Luôn hiển thị nhưng design tinh tế hơn */}
            <Link
              to="/employer"
              className="hidden lg:inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-[15px] transition-colors"
            >
              <Users className="w-5 h-5" strokeWidth={2} />
              <span>Nhà tuyển dụng</span>
            </Link>

            {/* Divider */}
            <div className="hidden lg:block h-8 w-[1px] bg-slate-200"></div>

            {user ? (
              /* === LOGGED IN STATE === */
              /* Chỉ hiển thị Profile Card, KHÔNG CÓ Logout */
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100 transition-all duration-300 group"
              >
                {/* Avatar */}
                <div className="relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-white" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white ring-2 ring-white shadow-md">
                      <User className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  )}
                  {/* Online Dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                
                {/* Name & Role */}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                    {user.name || "User"}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                    Dashboard <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ) : (
              /* === GUEST STATE === */
              <div className="hidden md:flex items-center gap-4">
                {/* Login Text Button */}
                <NavLink
                  to="/login"
                  className="text-[15px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Đăng nhập
                </NavLink>

                {/* Register Premium Button */}
                <NavLink
                  to="/register"
                  className="relative group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-[15px] font-bold overflow-hidden shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                   {/* Gradient background animation */}
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] animate-gradient"></div>
                   
                   <span className="relative flex items-center gap-2">
                     Đăng ký ngay
                     <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                   </span>
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Menu className="w-7 h-7" strokeWidth={2} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}