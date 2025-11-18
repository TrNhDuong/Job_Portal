import React, { useState } from "react";
import "../App.css";
import { 
  HiMenu, HiShoppingCart, HiX, HiUser, 
  HiInformationCircle, HiLogout, HiOutlineSpeakerphone 
} from "react-icons/hi";

import ToggleButton from "../components/ToggleButton.jsx";
import NavItem from "../components/NavItem.jsx";
import TopNavButton from "../components/TopNavButton.jsx";

import EmployerPostJob from "./EmployerPostJob.jsx";
import CVManage from "./employerManage.jsx"; 
import EmployerProfile from "./employerProfile.jsx";
import EmployerManagePosts from "./EmployerManagePosts.jsx"; 

import logoImage from "../assets/logo.png";

const SAMPLE_POSTS_FOR_TESTING = [
  { 
    id: 1001, 
    title: "Frontend Developer (ReactJS)", 
    position: "Software Engineer",
    location: "TP. Hồ Chí Minh", 
    detailedAddress: "123 Quận 1",
    minSalary: "15000000", 
    maxSalary: "30000000", 
    currency: "VND", 
    jobType: "Full-time",
    major: "IT",
    customMajor: "",
    degree: "Bachelor",
    experience: "2",
    description: "Mô tả công việc cho Frontend Developer (Sample)."
  },
  { 
    id: 1002, 
    title: "Chuyên viên Thiết kế Giao diện", 
    position: "UI/UX Designer",
    location: "TP. Đà Nẵng", 
    detailedAddress: "456 Hải Châu",
    minSalary: "12000000", 
    maxSalary: "25000000", 
    currency: "VND", 
    jobType: "Part-time",
    major: "Other",
    customMajor: "Thiết kế đồ họa",
    degree: "Diploma",
    experience: "1",
    description: "Mô tả công việc cho UI/UX Designer (Sample)."
  }
];

export default function Homepage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSetting, setActiveSetting] = useState(null);

  const [jobPosts, setJobPosts] = useState(SAMPLE_POSTS_FOR_TESTING);
  const [editingPost, setEditingPost] = useState(null);

  const tabNameMap = {
    setting11: "Cài đặt 11",
    setting12: "Cài đặt 12",
    setting13: "Cài đặt 13",
    CVManage: "Quản lý CV",
    ManagePosts: "Quản lý bài đăng",
    setting31: "Cài đặt 31",
    setting32: "Cài đặt 32",
    setting33: "Cài đặt 33",
    CVPost: "Đăng tin tuyển dụng",
    About: "Về chúng tôi",
    Renew: "Gia hạn",
    Logout: "Đăng xuất",
    Profile: "Tài khoản",
  };

  // ✅ REAL LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    window.location.href = "/login"; 
  };

  const handlePostSubmit = (postData) => {
    if (postData.id) {
      setJobPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postData.id ? postData : p))
      );
    } else {
      const newPost = { ...postData, id: new Date().getTime() };
      setJobPosts((prevPosts) => [newPost, ...prevPosts]);
    }
    setEditingPost(null);
    setActiveSetting("ManagePosts");
  };

  const handleEditClick = (postToEdit) => {
    setEditingPost(postToEdit);
    setActiveSetting("CVPost");
  };

  const handleDeletePost = (postIdToDelete) => {
    setJobPosts((prevPosts) =>
      prevPosts.filter((p) => p.id !== postIdToDelete)
    );
  };

  const handlePostNavClick = () => {
    setEditingPost(null); 
    setActiveSetting("CVPost");
  };

  return (
    <div>
      {/* TOP BAR */}
      <div
        className="hotbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={logoImage} 
            alt="Inspire Leader Logo" 
            style={{ height: "48px", width: "auto" }} 
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <TopNavButton icon={HiOutlineSpeakerphone} label="Đăng tin tuyển dụng" onClick={handlePostNavClick} />
          <TopNavButton icon={HiInformationCircle} label="Về chúng tôi" onClick={() => alert("About Page")} />
          <TopNavButton icon={HiShoppingCart} label="Gia hạn" onClick={() => alert("You have been scammed.")} />
          {/* ✅ NEW LOGOUT */}
          <TopNavButton icon={HiLogout} label="Đăng xuất" onClick={handleLogout} />
          <TopNavButton icon={HiUser} label="Tài khoản" onClick={() => setActiveSetting("Profile")} />
        </div>
      </div>

      {/* PAGE LAYOUT */}
      <div
        className="page-wrap"
        style={{
          display: "grid",
          gridTemplateColumns: collapsed ? "5% 1fr" : "17.5% 1fr",
          transition: "grid-template-columns 0.3s ease",
        }}
      >
        {/* LEFT SIDEBAR */}
        <div className="left-col">
          <ToggleButton collapsed={collapsed} onClick={() => setCollapsed((prev) => !prev)} />

          <NavItem 
            icon="⚙️" 
            label="Cài đặt 1" 
            collapsed={collapsed} 
            isActive={activeSetting && activeSetting.startsWith("setting1")}
          >
            <div className={`nav-item ${activeSetting === "setting11" ? "active" : ""}`} onClick={() => setActiveSetting("setting11")}>⚙️ Cài đặt 11</div>
            <div className={`nav-item ${activeSetting === "setting12" ? "active" : ""}`} onClick={() => setActiveSetting("setting12")}>⚙️ Cài đặt 12</div>
            <div className={`nav-item ${activeSetting === "setting13" ? "active" : ""}`} onClick={() => setActiveSetting("setting13")}>⚙️ Cài đặt 13</div>
          </NavItem>

          <NavItem
            icon="⚙️"
            label="Quản lý CV"
            collapsed={collapsed}
            onClick={() => setActiveSetting("CVManage")}
            isActive={activeSetting === "CVManage"}
          />
          
          <NavItem
            icon="⚙️"
            label="Quản lý bài đăng"
            collapsed={collapsed}
            onClick={() => setActiveSetting("ManagePosts")}
            isActive={activeSetting === "ManagePosts"}
          />

          <NavItem 
            icon="⚙️" 
            label="Cài đặt 3" 
            collapsed={collapsed} 
            isActive={activeSetting && activeSetting.startsWith("setting3")}
          >
            <div className={`nav-item ${activeSetting === "setting31" ? "active" : ""}`} onClick={() => setActiveSetting("setting31")}>⚙️ Cài đặt 31</div>
            <div className={`nav-item ${activeSetting === "setting32" ? "active" : ""}`} onClick={() => setActiveSetting("setting32")}>⚙️ Cài đặt 32</div>
            <div className={`nav-item ${activeSetting === "setting33" ? "active" : ""}`} onClick={() => setActiveSetting("setting33")}>⚙️ Cài đặt 33</div>
          </NavItem>

          <hr className="nav-separator" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="right-panel">
          <div
            className="tab-name-bar"
            style={{
              left: collapsed ? "5%" : "17.5%",
              width: "120%",
              transition: "left 0.3s ease",
            }}
          >
            {tabNameMap[activeSetting] || (activeSetting === "Profile" ? "Tài khoản" : "Cài đặt")}
          </div>

          <div style={{ marginTop: "70px" }}>
            {activeSetting === null && (
              <h1 className="title">Chọn một cài đặt để xem nội dung</h1>
            )}

            {activeSetting === "setting11" && (
              <div className="card"><h3>Cài đặt 11</h3><p>Đây sẽ là phần bảng tin</p></div>
            )}
            
            {activeSetting === "setting12" && (
              <div className="card"><h3>Cài đặt 12</h3><p>Đây sẽ là phần CV đề xuất</p></div>
            )}

            {activeSetting === "setting13" && (
              <div className="card"><h3>Cài đặt 13</h3><p>Đây là phần đổi quà</p></div>
            )}

            {activeSetting === "CVManage" && (
              <div style={{ paddingTop: 10 }}>
                <CVManage collapsed={collapsed} jobPosts={jobPosts} />
              </div>
            )}
            
            {activeSetting === "ManagePosts" && (
              <EmployerManagePosts
                posts={jobPosts}
                onEdit={handleEditClick}
                onDelete={handleDeletePost}
                collapsed={collapsed}
              />
            )}

            {activeSetting === "setting31" && (
              <div className="card"><h3>Cài đặt 31</h3><p>Đây là phần lịch sử hoạt động</p></div>
            )}

            {activeSetting === "setting32" && (
              <div className="card"><h3>Cài đặt 32</h3><p>Đây là phần thông báo hệ thống</p></div>
            )}

            {activeSetting === "setting33" && (
              <div className="card"><h3>Cài đặt 33</h3><p>Đây thực sự là phần cài đặt</p></div>
            )}

            {activeSetting === "CVPost" && (
              <div style={{ paddingTop: 10 }}>
                <EmployerPostJob
                  onSubmit={handlePostSubmit}
                  initialData={editingPost}
                />
              </div>
            )}

            {activeSetting === "Profile" && (
              <div style={{ paddingTop: 10 }}>
                <EmployerProfile />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
