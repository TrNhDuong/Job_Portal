// src/components/DashboardSidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  FileText,
  Settings,
  Briefcase,
  Bell,
  ChevronDown,
  ShieldAlert,
  LogOut,
} from "lucide-react";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isSettingsActive = location.pathname.startsWith("/dashboard/settings");
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  useEffect(() => {
    if (isSettingsActive) setIsSettingsOpen(true);
  }, [isSettingsActive]);

  if (!user) return null;

  // --- STYLES ---

  // Nút menu chính
  const baseLinkStyle =
    "group flex items-center gap-3.5 px-5 py-3 rounded-2xl transition-all duration-300 ease-out text-[15px] font-semibold select-none relative";

  const activeStyle =
    "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200";

  const inactiveStyle =
    "text-slate-500 hover:bg-slate-50 hover:text-slate-900";

  const getNavLinkClass = ({ isActive }) =>
    `${baseLinkStyle} ${isActive ? activeStyle : inactiveStyle}`;

  // Sub-menu
  const getSubLinkClass = ({ isActive }) =>
    `relative pl-12 pr-4 py-2.5 flex items-center text-[15px] rounded-xl
     transition-colors duration-200
     ${
       isActive
         ? "text-indigo-600 font-semibold bg-white shadow-sm"
         : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
     }`;

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch (e) {
      console.warn("Cannot clear token:", e);
    }

    if (typeof logout === "function") logout();

    navigate("/");
  };

  return (
    // Thêm px-4 cho sidebar để nút không dính sát mép
    <aside className="h-screen w-80 bg-white/95 border-r border-slate-100 shadow-[5px_0_30px_rgba(15,23,42,0.06)] flex flex-col font-sans px-4">
      {/* PROFILE */}
      <div className="pt-6 pb-4">
        <div className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 shadow-sm">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-300/60">
              <User className="w-7 h-7" />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
              {user.name}
            </h3>
            <p className="text-sm text-slate-500 truncate mb-1.5">
              {user.email}
            </p>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-[11px] font-extrabold tracking-wide uppercase">
              <ShieldAlert className="w-3 h-3" />
              Chưa xác thực
            </span>
          </div>
        </div>
      </div>

      {/* NAV + LOGOUT cùng một khối, để không phải scroll mới thấy */}
      <nav className="flex-1 flex flex-col gap-2 pb-4">
        <div className="px-1 mt-1 mb-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">
          Ứng viên
        </div>

        <NavLink to="/dashboard" end className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <Briefcase
                className={`w-5 h-5 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
                strokeWidth={2}
              />
              <span>Việc làm phù hợp</span>
            </>
          )}
        </NavLink>

        <NavLink to="/dashboard/my-cv" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <FileText
                className={`w-5 h-5 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
                strokeWidth={2}
              />
              <span>Hồ sơ &amp; CV</span>
            </>
          )}
        </NavLink>

        <div className="h-3" />

        <div className="px-1 mb-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.18em]">
          Tài khoản
        </div>

        {/* SETTINGS + SUB-MENU */}
        <div className="flex flex-col">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`w-full justify-between ${baseLinkStyle} ${
              isSettingsActive
                ? "text-slate-900 bg-slate-50"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Settings
                className={`w-5 h-5 ${
                  isSettingsActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
                strokeWidth={2}
              />
              <span>Cài đặt chung</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                isSettingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              isSettingsOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden relative mt-1 space-y-1 pb-1">
              <div className="absolute left-[30px] top-0 bottom-2 w-[2px] bg-slate-100 rounded-full" />

              <NavLink
                to="/dashboard/settings/profile"
                className={getSubLinkClass}
              >
                Thông tin cá nhân
              </NavLink>
              <NavLink
                to="/dashboard/settings/password"
                className={getSubLinkClass}
              >
                Đổi mật khẩu
              </NavLink>
              <NavLink
                to="/dashboard/settings/security"
                className={getSubLinkClass}
              >
                Bảo mật 2 lớp
              </NavLink>
            </div>
          </div>
        </div>

        <NavLink to="/dashboard/notifications" className={getNavLinkClass}>
          {({ isActive }) => (
            <>
              <Bell
                className={`w-5 h-5 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
                strokeWidth={2}
              />
              <span>Thông báo &amp; Email</span>
            </>
          )}
        </NavLink>

        {/* LOGOUT: nằm ngay dưới menu, luôn thấy được */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-3 px-5 py-3 rounded-2xl text-[15px] font-semibold
                     bg-red-500 text-white shadow-md shadow-red-300/60 border border-red-500
                     hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-400/60
                     active:bg-red-700 active:border-red-700
                     transition-all duration-200"
        >
          <LogOut className="w-5 h-5" strokeWidth={2.3} />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );
}
