// frontend/src/pages/Homepage.jsx
import React, { useState, useContext, useEffect } from "react"; // <--- SỬA: Thêm useContext
import "../App.css";
import { HiMenu, HiShoppingCart, HiX, HiUser, HiInformationCircle, HiLogout, HiDocumentAdd, HiUserGroup, HiOutlineBriefcase } from "react-icons/hi"; 
import { AuthContext } from "../context/AuthContext.jsx"; 
import client from "../api/client.js";

import NavItem from "../components/NavItem.jsx";
import TopNavButton from "../components/TopNavButton.jsx";
import EmployerPostJob from "./EmployerPostJob.jsx";
import CVManage from "./employerManage.jsx"; 
import EmployerProfile from "./employerProfile.jsx";
import EmployerManagePosts from "./EmployerManagePosts.jsx"; 
import UserProfileChip from "../components/UserProfileChip.jsx";
import AboutPage from "./AboutPage.jsx";

// (Giả sử bạn có logo.png trong src/assets)
import logoImage from "../assets/logo.png"; 

export default function Homepage() {
  const [activeSetting, setActiveSetting] = useState("ManagePosts");

  // Lấy hàm logout từ Context
  const { auth, logout } = useContext(AuthContext); // <--- THÊM

  const [isLoading, setIsLoading] = useState(true);

  // (State cho bài đăng - VẪN DÙNG DỮ LIỆU MẪU)

  // const [jobPosts, setJobPosts] = useState(SAMPLE_POSTS_FOR_TESTING);
  const [jobPosts, setJobPosts] = useState([])

  const [editingPost, setEditingPost] = useState(null);
  // -------------------------------------------------

  const [employerName, setEmployerName] = useState("");

  const loadDashboardData = async () => {
        if (!auth.user || !auth.user.email) {
          console.error("User email không tồn tại trong AuthContext");
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        try {
            // 1. Tải các bài đăng (Logic cũ)
            const userData = await client.get(
              `/api/employer/${auth.user.email}`
            )
            const email = localStorage.getItem("email");
            const res = await client.get(`/api/post-job?email=${email}`);
            const {employerData} = res.data;

            setJobPosts(jobsRes.data.data); 

            // Chúng ta lấy 'company' hoặc 'name', ưu tiên 'company'
            const name = employerData.company || profileRes.data.name || auth.user.email;
            setEmployerName(name);

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dashboard:", error);
        } finally {
            setIsLoading(false);
        }
  };

  // --- HÀM TẢI DỮ LIỆU (ĐƯỢC TÁCH RA) ---
  useEffect(() => {
    loadDashboardData(); // Chạy hàm
  }, [auth.user]);

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
  
  // (Tất cả các hàm logic CRUD ... giữ nguyên)
  const handlePostSubmit = async (postData) => {
    // 'postData' là dữ liệu ĐÃ ĐƯỢC ĐỊNH DẠNG từ EmployerPostJob.jsx
    
    // Tạm thời hiển thị loading (Chúng ta có thể làm nút bấm loading sau)
    setIsLoading(true);

    try {
      if (postData.id) {
        // --- LOGIC SỬA (UPDATE) ---
        
        // 1. Tách 'id' ra khỏi 'postData' vì 'id' là '_id' từ MongoDB
        // 'dataToUpdate' là phần còn lại (title, salary, description...)
        const { id, ...dataToUpdate } = postData;

        // 2. Gọi API PATCH
        // (Token đã được client.js tự động đính kèm)
        await client.patch(`/api/post-job/${id}`, dataToUpdate);
        
      } else {
        // --- LOGIC ĐĂNG TIN MỚI (POST) ---
        await client.post("/api/post-job", postData);
      }

      // 3. Tải lại danh sách job từ server
      await loadDashboardData();
      
      // 4. Reset và chuyển trang
      setEditingPost(null); // Xóa trạng thái "đang sửa"
      setActiveSetting("ManagePosts"); // Chuyển về trang Quản lý

    } catch (error) {
      console.error("Lỗi khi đăng/sửa bài:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại."); 
      setIsLoading(false); // Tắt loading nếu lỗi
    }
    
  };

  // Hàm này được gọi bởi 'employerProfile' (con)
  // để cập nhật 'employerName' (của Homepage - cha)
  const handleProfileUpdate = (newName) => {
    setEmployerName(newName);
  };

  const handleEditClick = (postToEdit) => {
    setEditingPost(postToEdit);
    setActiveSetting("CVPost");
  };

  const handleDeletePost = async (postIdToDelete) => {
    // BƯỚC 1: Lấy state hiện tại (để khôi phục nếu lỗi)
    const previousJobPosts = jobPosts;

    // BƯỚC 2: Cập nhật giao diện ngay lập tức (để người dùng thấy nhanh)
    setJobPosts((prevPosts) =>
        prevPosts.filter((p) => p._id !== postIdToDelete)
    );

    // BƯỚC 3: Gọi API để xóa thật trong CSDL
    try {
        // Chúng ta dùng _id (postIdToDelete) để gọi API
        await client.delete(`/api/post-job/${postIdToDelete}`);
        
        // (Nếu thành công thì không cần làm gì, giao diện đã cập nhật rồi)

    } catch (error) {
        // BƯỚC 4: Nếu API lỗi (ví dụ: server sập, 403 Forbidden)
        console.error("Lỗi khi xóa bài đăng:", error);
        alert("Xóa bài đăng thất bại! Đang khôi phục danh sách.");
        
        // Hoàn tác lại thay đổi trên giao diện
        setJobPosts(previousJobPosts);
    }
};
  
  const handlePostNavClick = () => {
    setEditingPost(null); 
    setActiveSetting("CVPost");
  };
  
  return (
    <div>
      <div
        className="hotbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        <div 
          className="logo-container" 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setActiveSetting("ManagePosts")} /* <-- THÊM DÒNG NÀY */
        >
          <img src={logoImage} alt="Logo" style={{ height: "48px", width: "auto" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <TopNavButton icon={HiDocumentAdd} label="Đăng tin tuyển dụng" onClick={handlePostNavClick} />
          <TopNavButton 
            icon={HiInformationCircle} 
            label="Về chúng tôi" 
            onClick={() => setActiveSetting("About")} // <-- SỬA DÒNG NÀY
          />
          <TopNavButton icon={HiShoppingCart} label="Gia hạn" onClick={() => alert("You have been scammed.")} />
          <TopNavButton icon={HiLogout} label="Đăng xuất" onClick={logout} /> {/* <--- SỬA Ở ĐÂY */}
          <UserProfileChip 
            name={employerName} 
            onClick={() => setActiveSetting("Profile")} 
          />
        </div>
      </div>

      <div
        className="page-wrap"
        style={{
          display: "grid",
          gridTemplateColumns: "17.5% 1fr",
          transition: "grid-template-columns 0.3s ease",
        }}
      >
        {/* --- Sidebar (Trái) --- */}
        <div className="left-col">

          <NavItem 
            icon="⚙️" 
            label="Cài đặt 1" 
            isActive={activeSetting && activeSetting.startsWith("setting1")}
          >
            <div 
              className={`nav-item ${activeSetting === "setting11" ? "active" : ""}`} 
              onClick={() => setActiveSetting("setting11")}
            >⚙️ Cài đặt 11</div>
            <div 
              className={`nav-item ${activeSetting === "setting12" ? "active" : ""}`} 
              onClick={() => setActiveSetting("setting12")}
            >⚙️ Cài đặt 12</div>
            <div 
              className={`nav-item ${activeSetting === "setting13" ? "active" : ""}`} 
              onClick={() => setActiveSetting("setting13")}
            >⚙️ Cài đặt 13</div>
          </NavItem>

          <NavItem
            icon={<HiUserGroup />}
            label="Quản lý CV"
            onClick={() => setActiveSetting("CVManage")}
            isActive={activeSetting === "CVManage"}
          />
          
          <NavItem
            icon={<HiOutlineBriefcase />}
            label="Quản lý bài đăng"
            onClick={() => setActiveSetting("ManagePosts")}
            isActive={activeSetting === "ManagePosts"}
          />

          <NavItem 
            icon="⚙️" 
            label="Cài đặt 3" 
            isActive={activeSetting && activeSetting.startsWith("setting3")}
          >
            <div 
              className={`nav-item ${activeSetting === "setting31" ? "active" : ""}`} 
              onClick={() => setActiveSetting("setting31")}
            >⚙️ Cài đặt 31</div>
            <div 
              className={`nav-item ${activeSetting === "setting32" ? "active" : ""}`} 
              onClick={() => setActiveSetting("setting32")}
            >⚙️ Cài đặt 32</div>
            <div 
              className={`nav-item ${activeSetting === "setting33" ? "active" : ""}`} 
              onClick={() => setActiveSetting("setting33")}
            >⚙️ Cài đặt 33</div>
          </NavItem>

          <hr className="nav-separator" />
        </div>

        {/* --- Nội dung (Phải) --- */}
        <div className="right-panel">
          
          <div
            className="tab-name-bar"
            style={{
              left: "17.5%",
              width: "82.5%",
              transition: "left 0.3s ease",
            }}
          >
            {tabNameMap[activeSetting] || (activeSetting === "Profile" ? "Tài khoản" : "Cài đặt")}
          </div>

          <div style={{ marginTop: "70px" }}>

            {/* --- THÊM LOGIC LOADING --- */}
            {isLoading ? (
              <div className="card">
                <h3>Đang tải dữ liệu...</h3>
              </div>
            ) : (
              // --- Nếu không loading, hiển thị nội dung cũ ---
            <>

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
                <CVManage 
                  jobPosts={jobPosts} // Truyền dữ liệu mẫu
                />
              </div>
            )}
            
            {activeSetting === "ManagePosts" && (
              <EmployerManagePosts
                posts={jobPosts}
                onEdit={handleEditClick}
                onDelete={handleDeletePost}
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
                <EmployerProfile onProfileUpdate={handleProfileUpdate} />
              </div>
            )}

            {activeSetting === "About" && (
              <div style={{ paddingTop: 10 }}>
                <AboutPage />
              </div>
            )}
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}