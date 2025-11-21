// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import {
  Menu,
  User,
  Home,
  Briefcase,
  Sparkles,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth();
  const EMPLOYER_URL = "http://localhost:8000/login";
  // --- STYLES ---
  // Update: Tăng text lên [17px], tăng padding để nút to và "đầm" hơn
  const navItemStyle = ({ isActive }) =>
    `group flex items-center gap-2.5 px-7 py-3 rounded-full text-[17px] font-bold transition-all duration-300 ease-out border
     ${
       isActive
         ? "bg-white text-indigo-600 border-indigo-100 shadow-[0_4px_12px_rgba(99,102,241,0.15)] translate-y-[-1px]" 
         : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
     }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="h-28 flex items-center">
          
          {/* 1. LOGO AREA - Tăng kích thước vùng chứa */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group select-none mr-10">
            <div className="relative">
               <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               {/* Logo to hơn một chút để cân xứng với chữ */}
               <img
                src={logo}
                alt="Inspire Leader"
                className="relative h-16 w-auto drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* 2. RIGHT SIDE CONTENT */}
          <div className="flex items-center justify-end flex-1 gap-8">

            {/* MAIN NAV LINKS */}
            <nav className="hidden md:flex items-center gap-4">
              <NavLink to="/" className={navItemStyle}>
                {({ isActive }) => (
                  <>
                    {/* Icon to hơn (w-5 h-5) */}
                    <Home className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"}`} strokeWidth={2.5} />
                    <span>Trang chủ</span>
                  </>
                )}
              </NavLink>

              <NavLink to="/jobs" className={navItemStyle}>
                {({ isActive }) => (
                  <>
                    <Briefcase className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"}`} strokeWidth={2.5} />
                    <span>Việc làm</span>
                  </>
                )}
              </NavLink>
            </nav>

            {/* Link "Nhà Tuyển Dụng" - Tăng size chữ */}
            <a
              href={EMPLOYER_URL}
              className="hidden xl:inline-flex items-center text-slate-500 hover:text-slate-900 font-bold text-[16px] transition-colors relative group px-2 cursor-pointer"
            >
              <span>Nhà tuyển dụng</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </a>

            {/* Divider */}
            <div className="hidden lg:block h-10 w-[1px] bg-slate-200/80"></div>

            {/* AUTH BUTTONS */}
            {user ? (
              /* === LOGGED IN === */
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-3.5 pl-2 pr-5 py-2 rounded-full bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group"
              >
                <div className="relative">
                   {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-11 h-11 rounded-full object-cover ring-2 ring-white" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ring-2 ring-white">
                        <User className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                    )}
                   <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                
                <div className="flex flex-col items-start">
                  {/* Tên user to hơn */}
                  <span className="text-[15px] font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                    {user.name || "Tài khoản"}
                  </span>
                  <span className="text-[12px] text-slate-400 font-semibold">Dashboard</span>
                </div>
              </Link>
            ) : (
              /* === GUEST === */
              <div className="hidden md:flex items-center gap-4">
                {/* Nút Đăng nhập to hơn */}
                <NavLink
                  to="/login"
                  className="px-5 py-2.5 text-[16px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Đăng nhập
                </NavLink>

                {/* Nút Đăng ký to và nổi bật hơn */}
                <NavLink
                  to="/register"
                  className="relative group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-slate-900 text-white text-[16px] font-bold overflow-hidden shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient"></div>
                   <span className="relative flex items-center gap-2">
                     Đăng ký ngay
                     <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                   </span>
                </NavLink>
              </div>
            )}

            <button className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <Menu className="w-9 h-9" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}