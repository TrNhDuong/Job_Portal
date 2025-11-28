// src/components/Navbar.jsx
import { NavLink, Link } from "react-router-dom";
import { Menu, User, Home, Briefcase, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth();
  const EMPLOYER_URL = "http://localhost:8000/login";

  // class cho item menu chính
  const navItemClass = ({ isActive }) =>
    `navbar-pill ${isActive ? "navbar-pill-active" : ""}`;

  return (
    <header className="navbar-root">
      <div className="navbar-shell">
        <div className="navbar-bar">
          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-glow" />
            <img src={logo} alt="CDH Job Portal" className="navbar-logo-img" />
          </Link>

          {/* NAV LINKS + AUTH */}
          <div className="navbar-right">
            {/* Các link chính */}
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

            {/* Link Nhà tuyển dụng */}
            <a
              href={EMPLOYER_URL}
              className="navbar-employer-link"
            >
              <span>Nhà tuyển dụng</span>
              <span className="navbar-employer-underline" />
            </a>

            <div className="navbar-divider" />

            {/* Auth area */}
            {user ? (
              // Đã đăng nhập
              <Link to="/dashboard" className="navbar-user">
                <div className="navbar-user-avatar-wrap">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="navbar-user-avatar-img"
                    />
                  ) : (
                    <div className="navbar-user-avatar-fallback">
                      <User className="navbar-user-avatar-icon" />
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
              // Chưa đăng nhập
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

            {/* Menu mobile (chưa làm drawer, chỉ icon) */}
            <button className="navbar-menu-btn">
              <Menu className="navbar-menu-icon" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
