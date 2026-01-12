// src/components/DashboardSidebar.jsx
import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FileText, Briefcase, Bell, LogOut, ChevronRight } from "lucide-react";

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const avatarUrl = useMemo(() => {
    return (
      user.logo?.url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || user.email || "U"
      )}&background=4f46e5&color=fff`
    );
  }, [user]);

  const getNavLinkClass = ({ isActive }) =>
    ["dashboard-nav-link", isActive ? "dashboard-nav-link-active" : ""]
      .filter(Boolean)
      .join(" ");

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    if (typeof logout === "function") logout();
    navigate("/");
  };

  const handleOpenProfile = () => navigate("/dashboard/settings/profile");

  return (
    <aside className="dashboard-sidebar dashboard-sidebar-lg">
      {/* PROFILE CARD */}
      <button
        type="button"
        className="dashboard-profile-card dashboard-profile-card-lg"
        onClick={handleOpenProfile}
        aria-label="Mở hồ sơ"
      >
        <div className="dashboard-profile-top">
          <div className="dashboard-avatar-circle dashboard-avatar-circle-lg">
            <img
              src={avatarUrl}
              alt={user.name || "Avatar"}
              className="dashboard-avatar-img"
            />
          </div>

          <div className="dashboard-profile-text">
            <div className="dashboard-profile-info-name dashboard-profile-info-name-lg">
              {user.name || "Ứng viên"}
            </div>
            <p className="dashboard-profile-info-email dashboard-profile-info-email-lg">
              {user.email}
            </p>

            <div className="dashboard-profile-cta">
              <span>Xem hồ sơ</span>
              <ChevronRight className="dashboard-profile-cta-icon" />
            </div>
          </div>
        </div>
      </button>

      {/* NAV */}
      <nav className="dashboard-nav dashboard-nav-lg">
        <div className="dashboard-nav-group-label">Ứng viên</div>

        <NavLink to="/dashboard" end className={getNavLinkClass}>
          <Briefcase className="dashboard-nav-link-icon" />
          <span>Việc làm của tôi</span>
        </NavLink>

        <NavLink to="/dashboard/my-cv" className={getNavLinkClass}>
          <FileText className="dashboard-nav-link-icon" />
          <span>Sơ yếu lý lịch (CV)</span>
        </NavLink>

        {/* <div className="dashboard-nav-group-label">Thông báo</div> */}

        {/* <NavLink to="/dashboard/notifications" className={getNavLinkClass}>
          <Bell className="dashboard-nav-link-icon" />
          <span>Thông báo &amp; Email</span>
        </NavLink> */}

        {/* FOOTER ACTION */}
        <div className="dashboard-sidebar-footer">
          <button
            type="button"
            onClick={handleLogout}
            className="dashboard-logout-btn dashboard-logout-btn-lg"
          >
            <LogOut className="dashboard-logout-icon" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
