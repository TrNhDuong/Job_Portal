import React, { useState } from "react";
import "../App.css";
import { HiMenu, HiShoppingCart, HiX, HiUser, HiInformationCircle, HiLogout } from "react-icons/hi";

import ToggleButton from "../components/ToggleButton.jsx";
import NavItem from "../components/NavItem.jsx";
import TopNavButton from "../components/TopNavButton.jsx";
import EmployerPostJob from "./EmployerPostJob.jsx";
import CVManage from "./employerManage.jsx"; // Vẫn là trang quản lý CV ứng viên
import EmployerProfile from "./employerProfile.jsx";
import EmployerManageCVs from "./employerManage.jsx";

// --- TÔI ĐÃ THÊM ---
// Import trang Quản lý bài đăng mới
import EmployerManagePosts from "./EmployerManagePosts.jsx"; 
// -----------------

export default function Homepage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSetting, setActiveSetting] = useState(null);

  // --- TÔI ĐÃ THÊM: Quản lý trạng thái cho bài đăng ---
  // state lưu trữ danh sách các bài đăng (lưu tạm thời ở đây)
  const [jobPosts, setJobPosts] = useState([]);
  
  // state lưu trữ bài đăng đang được chỉnh sửa
  const [editingPost, setEditingPost] = useState(null);
  // -------------------------------------------------

  const tabNameMap = {
    setting11: "Cài đặt 11",
    setting12: "Cài đặt 12",
    setting13: "Cài đặt 13",
    CVManage: "Quản lý CV",
    // --- TÔI ĐÃ THÊM ---
    ManagePosts: "Quản lý bài đăng", // Tên cho tab mới
    // -----------------
    setting31: "Cài đặt 31",
    setting32: "Cài đặt 32",
    setting33: "Cài đặt 33",
    CVPost: "Đăng tin tuyển dụng", // (Đổi tên này cho logic)
    About: "Về chúng tôi",
    Renew: "Gia hạn",
    Logout: "Đăng xuất",
    Profile: "Tài khoản",
  };
  
  // --- TÔI ĐÃ THÊM: Hàm xử lý logic CRUD ---

  /**
   * Hàm này được truyền xuống EmployerPostJob.jsx
   * Nó sẽ được gọi khi form được submit
   */
  const handlePostSubmit = (postData) => {
    if (postData.id) {
      // --- CẬP NHẬT BÀI ĐĂNG (UPDATE) ---
      setJobPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postData.id ? postData : p))
      );
    } else {
      // --- THÊM BÀI ĐĂNG MỚI (CREATE) ---
      // Dùng timestamp làm ID tạm thời
      const newPost = { ...postData, id: new Date().getTime() };
      setJobPosts((prevPosts) => [newPost, ...prevPosts]); // Thêm vào đầu danh sách
    }
    
    // Sau khi submit, xóa trạng thái "đang sửa" và chuyển sang trang Quản lý
    setEditingPost(null);
    setActiveSetting("ManagePosts");
  };

  /**
   * Hàm này được truyền xuống EmployerManagePosts.jsx
   * Nó được gọi khi bấm nút "Chỉnh sửa"
   */
  const handleEditClick = (postToEdit) => {
    setEditingPost(postToEdit);
    setActiveSetting("CVPost"); // Chuyển về trang form
  };

  /**
   * Hàm này được truyền xuống EmployerManagePosts.jsx
   * Nó được gọi khi bấm nút "Xóa"
   */
  const handleDeletePost = (postIdToDelete) => {
    setJobPosts((prevPosts) =>
      prevPosts.filter((p) => p.id !== postIdToDelete)
    );
  };
  
  /**
   * Hàm này xử lý khi người dùng bấm vào "Đăng CV" trên top nav.
   * Nếu họ đang sửa 1 bài, chúng ta không muốn xóa nó.
   * Nếu họ không sửa gì, chúng ta muốn họ thấy 1 form trống.
   */
  const handlePostNavClick = () => {
    setEditingPost(null); // Reset trạng thái "đang sửa"
    setActiveSetting("CVPost"); // Mở form
  };
  
  // --- KẾT THÚC PHẦN THÊM MỚI ---

  return (
    <div>
      {/* Upper nav bar */}
      <div
        className="hotbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px" }}>CDH (Logo để sau)</h2>

        {/* TOP RIGHT MENU */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* --- TÔI ĐÃ SỬA --- */}
          {/* Sửa onClick để gọi hàm mới */}
          <TopNavButton label="Đăng CV" onClick={handlePostNavClick} />
          {/* ----------------- */}
          <TopNavButton icon={HiInformationCircle} label="Về chúng tôi" onClick={() => alert("About Page")} />
          <TopNavButton icon={HiShoppingCart} label="Gia hạn" onClick={() => alert("You have been scammed.")} />
          <TopNavButton icon={HiLogout} label="Đăng xuất" onClick={() => alert("Logout Page")} />
          <TopNavButton icon={HiUser} label="Tài khoản" onClick={() => setActiveSetting("Profile")} />

        </div>
      </div>

      {/* Bố cục */}
      <div
        className="page-wrap"
        style={{
          display: "grid",
          gridTemplateColumns: collapsed ? "5% 1fr" : "17.5% 1fr",
          transition: "grid-template-columns 0.3s ease",
        }}
      >
        <div className="left-col">
          <ToggleButton collapsed={collapsed} onClick={() => setCollapsed((prev) => !prev)} />

          <NavItem icon="⚙️" label="Cài đặt 1" collapsed={collapsed}>
            <div className="nav-item" onClick={() => setActiveSetting("setting11")}>⚙️ Cài đặt 11</div>
            <div className="nav-item" onClick={() => setActiveSetting("setting12")}>⚙️ Cài đặt 12</div>
            <div className="nav-item" onClick={() => setActiveSetting("setting13")}>⚙️ Cài đặt 13</div>
          </NavItem>

          <NavItem
            icon="⚙️"
            label="Quản lý CV"
            collapsed={collapsed}
            onClick={() => setActiveSetting("CVManage")}
          />
          
          {/* --- TÔI ĐÃ THÊM: NavItem MỚI --- */}
          <NavItem
            icon="⚙️"
            label="Quản lý bài đăng"
            collapsed={collapsed}
            onClick={() => setActiveSetting("ManagePosts")}
          />
          {/* ------------------------------- */}

          <NavItem icon="⚙️" label="Cài đặt 3" collapsed={collapsed}>
            <div className="nav-item" onClick={() => setActiveSetting("setting31")}>⚙️ Cài đặt 31</div>
            <div className="nav-item" onClick={() => setActiveSetting("setting32")}>⚙️ Cài đặt 32</div>
            <div className="nav-item" onClick={() => setActiveSetting("setting33")}>⚙️ Cài đặt 33</div>
          </NavItem>

          <hr className="nav-separator" />
        </div>

        {/* phần nội dung */}
        <div className="right-panel">
          <div
            className="tab-name-bar"
            style={{
              left: collapsed ? "5%" : "17.5%",
              width: "120%",
              transition: "left 0.3s ease",
            }}
          >
            {tabNameMap[activeSetting] || "Cài đặt"}
          </div>

          <div style={{ marginTop: "70px" }}>
            {activeSetting === null && (
              <h1 className="title">Chọn một cài đặt để xem nội dung</h1>
            )}

            {activeSetting === "setting11" && (
              // (Code Cài đặt 11... không đổi)
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
                <CVManage />
              </div>
            )}
            
            {/* --- TÔI ĐÃ SỬA: Thêm prop 'collapsed' --- */}
            {activeSetting === "ManagePosts" && (
              <EmployerManagePosts
                posts={jobPosts}
                onEdit={handleEditClick}
                onDelete={handleDeletePost}
                collapsed={collapsed} 
              />
            )}
            {/* ------------------------------------------- */}

            {activeSetting === "setting31" && (
              <div className="card"><h3>Cài đặt 31</h3><p>Đây là phần lịch sử hoạt động</p></div>
            )}

            {activeSetting === "setting32" && (
              <div className="card"><h3>Cài đặt 32</h3><p>Đây là phần thông báo hệ thống</p></div>
            )}

            {activeSetting === "setting33" && (
              <div className="card"><h3>Cài đặt 33</h3><p>Đây thực sự là phần cài đặt</p></div>
            )}

            {/* --- TÔI ĐÃ SỬA: Truyền props MỚI xuống form --- */}
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
            {/* ------------------------------------------- */}

          </div>
        </div>
      </div>
    </div>
  );
}