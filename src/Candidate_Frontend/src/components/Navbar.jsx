// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { Menu, User, Home, Briefcase, Sparkles, Building2 } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth();
  const EMPLOYER_URL = "http://localhost:4000";

  const navItemClass = ({ isActive }) =>
    `navbar-pill ${isActive ? "navbar-pill-active" : ""}`;

  const avatarUrl = user?.logo?.url || user?.avatar || null;

  const initials =
    user?.name
      ?.trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";

 return (
    <header className="navbar-root">
      <div className="navbar-shell">
        <div className="navbar-bar">
          {/* 1. LOGO (Bên trái) */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-glow" />
            <img src={logo} alt="CDH Job Portal" className="navbar-logo-img" />
          </Link>

          {/* 2. NAV LINKS (Di chuyển ra đây để nằm cạnh logo) */}
          <nav className="navbar-links">
            <NavLink to="/" className={navItemClass}>
              <Home className="navbar-icon" />
              <span>Trang chủ</span>
            </NavLink>

            <NavLink to="/jobs" className={navItemClass}>
              <Briefcase className="navbar-icon" />
              <span>Việc làm</span>
            </NavLink>
          </nav>

          {/* 3. RIGHT ACTIONS (Đẩy về phía xa bên phải) */}
          <div className="navbar-right">
            <a href={EMPLOYER_URL} className="navbar-employer-link">
              <div className="navbar-employer-content">
                <Building2 className="navbar-employer-icon" />
                <span>Nhà tuyển dụng</span>
              </div>
              <span className="navbar-employer-underline" />
            </a>

            <div className="navbar-divider" />

            {user ? (
              <Link to="/dashboard" className="navbar-user">
                <div className="navbar-user-avatar-wrap">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name || "avatar"}
                      className="navbar-user-avatar-img"
                    />
                  ) : (
                    <div className="navbar-user-avatar-fallback">
                      <span className="text-xs font-semibold">
                        {initials}
                      </span>
                    </div>
                  )}
                  <span className="navbar-user-status-dot" />
                </div>

                <div className="navbar-user-text">
                  <span className="navbar-user-name">
                    {user.name || "Tài khoản"}
                  </span>
                  <span className="navbar-user-sub">Dashboard</span>
                </div>
              </Link>
            ) : (
              <div className="navbar-auth-guest">
                <NavLink to="/login" className="navbar-login-link">
                  Đăng nhập
                </NavLink>

                <NavLink to="/register" className="navbar-register-btn">
                  <span className="navbar-register-btn-bg" />
                  <span className="navbar-register-btn-content">
                    Đăng ký ngay
                    <Sparkles className="navbar-register-icon" />
                  </span>
                </NavLink>
              </div>
            )}

            <button className="navbar-menu-btn">
              <Menu className="navbar-menu-icon" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
