// src/pages/settings/AccountSettingsLayout.jsx
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { Mail, Camera } from "lucide-react";

import "../../styles/dashboard.css";

export default function AccountSettingsLayout() {
  const { user, login } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  if (!user) return null;

  const initials =
    user.name
      ?.trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.email) return;

    const fd = new FormData();
    fd.append("image", file); // backend key: "image" cho logo candidate

    try {
      setUploadingAvatar(true);
      const res = await client.post(
        `/api/upload/logo/candidate?email=${encodeURIComponent(user.email)}`,
        fd
      );

      const newLogo = res.data?.data || res.data?.logo;
      if (newLogo?.url) {
        login({ ...user, logo: newLogo });
      } else {
        console.warn("Không nhận được logo.url từ server");
      }
    } catch (err) {
      console.error("Upload avatar error:", err);
      alert(
        err.response?.data?.message ||
          "Không thể cập nhật ảnh đại diện, hãy thử lại sau."
      );
    } finally {
      setUploadingAvatar(false);
      e.target.value = null;
    }
  };

  return (
    <div className="profile-shell">
      {/* HEADER: cover + avatar + tên + mini-tabs */}
      <header className="profile-header">
        <div className="profile-cover" />

        <div className="profile-header-main">
          <div className="profile-header-top">
            {/* AVATAR + ĐỔI ẢNH */}
            <label className="profile-avatar-wrap">
              <div className="profile-avatar">
                {user.logo?.url ? (
                  <img
                    src={user.logo.url}
                    alt={user.name || "Avatar"}
                    className="profile-avatar-img"
                  />
                ) : (
                  <span className="profile-avatar-initials">{initials}</span>
                )}
              </div>

              <div className="profile-avatar-edit">
                <Camera className="profile-avatar-edit-icon" />
                <span className="profile-avatar-edit-text">
                  {uploadingAvatar ? "Đang tải..." : "Đổi ảnh"}
                </span>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>

            {/* NAME + EMAIL */}
            <div className="profile-header-info">
              <h1 className="profile-name">{user.name || "Ứng viên"}</h1>
              <div className="profile-email-row">
                <Mail className="profile-email-icon" />
                <span className="profile-email-text">{user.email}</span>
              </div>
            </div>
          </div>

          {/* MINI TABS DƯỚI AVATAR */}
          <nav className="profile-tabs">
            <NavLink
              to="/dashboard/settings/profile"
              end
              className={({ isActive }) =>
                `profile-tab ${isActive ? "active" : ""}`
              }
            >
              Thông tin cá nhân
            </NavLink>
            <NavLink
              to="/dashboard/settings/password"
              className={({ isActive }) =>
                `profile-tab ${isActive ? "active" : ""}`
              }
            >
              Đổi mật khẩu
            </NavLink>
            <NavLink
              to="/dashboard/settings/security"
              className={({ isActive }) =>
                `profile-tab ${isActive ? "active" : ""}`
              }
            >
              Quyền riêng tư
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Phần nội dung từng tab (Profile / Password / Security) */}
      <Outlet />
    </div>
  );
}
