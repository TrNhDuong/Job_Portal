import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { Mail, Camera, User, Lock } from "lucide-react";

import "../../styles/dashboard.css"; // CSS tổng

export default function AccountSettingsLayout() {
  const { user, login } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return null;

  const initials = user.name?.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      setUploadingAvatar(true);
      const res = await client.post(
        `/api/upload/logo/candidate?email=${encodeURIComponent(user.email)}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const newLogo = res.data?.data || res.data?.logo;
      if (newLogo?.url) {
        login({ ...user, logo: newLogo });
      }
    } catch (err) {
      console.error("Upload avatar error:", err);
      alert("Không thể cập nhật ảnh đại diện.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = null;
    }
  };

  return (
    <div className="profile-shell">
      {/* --- HEADER --- */}
      <header className="profile-header">
        <div className="profile-cover"></div>

        <div className="profile-header-main">
          <div className="profile-header-top">
            {/* AVATAR */}
            <label className="profile-avatar-wrap">
              <div className="profile-avatar">
                {user.logo?.url ? (
                  <img src={user.logo.url} alt={user.name} className="profile-avatar-img" />
                ) : (
                  <span className="profile-avatar-initials">{initials}</span>
                )}
              </div>
              <div className="profile-avatar-edit">
                <Camera size={14} />
                <span>{uploadingAvatar ? "..." : "Sửa"}</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
            </label>

            {/* INFO */}
            <div className="profile-header-info">
              <h1 className="profile-name">{user.name || "Ứng viên"}</h1>
              <div className="profile-email-badge">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <nav className="profile-tabs">
            <NavLink to="/dashboard/settings/profile" end className={({ isActive }) => `profile-tab ${isActive ? "active" : ""}`}>
              <User size={16} /> Thông tin cá nhân
            </NavLink>
            <NavLink to="/dashboard/settings/password" className={({ isActive }) => `profile-tab ${isActive ? "active" : ""}`}>
              <Lock size={16} /> Đổi mật khẩu
            </NavLink>
          </nav>
        </div>
      </header>

      {/* --- BODY CONTENT (Render ProfileSettings here) --- */}
      <div className="profile-content-area">
        <Outlet />
      </div>
    </div>
  );
}