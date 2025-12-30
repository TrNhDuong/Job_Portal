import React, { useState } from "react";
import "../App.css";
import { HiLogout } from "react-icons/hi";
import { HiOutlineUsers, HiOutlineBriefcase, HiOutlineCog, HiOutlineInformationCircle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import monoLogo from "../assets/mono-logo.png";
import { AuthContext } from "../context/AuthContext.jsx";
import NavItem from "../components/NavItem.jsx";

import AboutPage from "./AboutPage.jsx";
import UserList from "./UserList.jsx";
import JobList from "./JobList.jsx";
import PlatformMonitor from "./AdminMonitor.jsx"

// Placeholder component – bạn thay API tuỳ backend
function AdminUserList() {
  return <div className="card"><h3>Danh sách tài khoản</h3></div>;
}

// Placeholder — bạn thay data tuỳ backend
function AdminJobList() {
  return <div className="card"><h3>Bài đăng tuyển dụng</h3></div>;
}

import Setting from "./Setting.jsx";

export default function AdminHomepage() {
  const navigate = useNavigate();
  const auth = React.useContext(AuthContext);

  const [activeSetting, setActiveSetting] = useState("Users");
  const [preSetting, setPreSetting] = useState(null);

  const logoUrl = monoLogo; // Admin không có logo công ty

  const tabNameMap = {
    UserList: "Danh sách tài khoản",
    Jobs: "Bài đăng tuyển dụng",
    About: "Về chúng tôi",
    Setting: "Cài đặt",
    Monitor: "Điều phối"
  };

  return (
    <div>
      <div className="dashboard-theme">
        <div
          className="page-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "17.5% 1fr",
            transition: "grid-template-columns 0.3s ease",
          }}
        >
          {/* SIDEBAR */}
          <div className="side-bar">
            <div className="sidebar-top-section">
              <div className="user-info-area">
                <img src={logoUrl} alt="Admin Avatar" className="user-avatar" />
                <div className="user-details">
                  <div className="user-info">Admin</div>
                  <div className="user-info" style={{ color: "#2563eb", fontWeight: "bold" }}>
                    Hệ thống InspireLeader
                  </div>
                </div>
              </div>
              <hr className="header-divider" />
            </div>

            <div className="sidebar-menu">
              <li className="menu-header">Quản lý hệ thống</li>

              <NavItem
                icon={<HiOutlineUsers />}
                label="Danh sách tài khoản"
                onClick={() => setActiveSetting("Users")}
                isActive={activeSetting === "Users"}
              />

              <NavItem
                icon={<HiOutlineBriefcase />}
                label="Bài đăng tuyển dụng"
                onClick={() => setActiveSetting("Jobs")}
                isActive={activeSetting === "Jobs"}
              />
              <NavItem
                icon={<HiOutlineBriefcase />}
                label="Điều phối platform"
                onClick={() => setActiveSetting("Monitor")}
                isActive={activeSetting === "Monitor"}
              />

              <li className="menu-header">Cài đặt quản lí</li>

              <NavItem
                icon={<HiOutlineInformationCircle />}
                label="Về chúng tôi"
                onClick={() => setActiveSetting("About")}
                isActive={activeSetting === "About"}
              />

              <NavItem
                icon={<HiOutlineCog />}
                label="Cài đặt"
                onClick={() => {
                  setPreSetting(activeSetting);
                  setActiveSetting("Setting");
                }}
                isActive={activeSetting === "Setting"}
              />

              <NavItem
                icon={<HiLogout />}
                label="Đăng xuất"
                onClick={() => {
                  auth.logout();
                  navigate("/login");
                }}
              />
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel">
            <div
              className="tab-name-bar"
              style={{
                left: "17.5%",
                width: "82.5%",
                transition: "left 0.3s ease",
              }}
            >
              {tabNameMap[activeSetting] || "Cài đặt"}
            </div>

            <div style={{ marginTop: "100px" }}>
              {activeSetting === "Users" && <div style={{ paddingTop: 10 }}><UserList /></div>}

              {activeSetting === "Jobs" && <div style={{ paddingTop: 10 }}><JobList /></div>}

              {activeSetting === "Monitor" && <div style={{ paddingTop: 10 }}><PlatformMonitor /></div>}

              {activeSetting === "About" && <div style={{ paddingTop: 10 }}><AboutPage /></div>}

              {activeSetting === "Setting" && (
                <Setting isVisible={true} onClose={() => setActiveSetting(preSetting)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
