// frontend/src/pages/Homepage.jsx
import React, { useRef, useState, useContext, useEffect } from "react"; // <--- SỬA: Thêm useContext
import "../App.css";
import { HiMenu, HiShoppingCart, HiX, HiUser, HiInformationCircle, HiLogout, HiDocumentAdd, HiUserGroup, HiOutlineBriefcase } from "react-icons/hi"; 
import { AuthContext } from "../context/AuthContext.jsx"; 
import client from "../api/client.js";
import { useNavigate } from "react-router-dom";
import NavItem from "../components/NavItem.jsx";
import TopNavButton from "../components/TopNavButton.jsx";
import EmployerPostJob from "./EmployerPostJob.jsx";
import CVManage from "./employerManage.jsx"; 
import EmployerProfile from "./employerProfile.jsx";
import EmployerManagePosts from "./EmployerManagePosts.jsx"; 
import UserProfileChip from "../components/UserProfileChip.jsx";
import AboutPage from "./AboutPage.jsx";

import logoImage from "../assets/logo.png"; 

export default function Homepage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const postCache = useRef(new Map()); // Cache cho các bài đăng đã tải

  const [activeSetting, setActiveSetting] = useState("ManagePosts");
  const [isLoading, setIsLoading] = useState(true);
  const [jobPosts, setJobPosts] = useState([])
  const [editingPost, setEditingPost] = useState(null);
  const [employerName, setEmployerName] = useState("");

  const loadDashboardData = async () => {
        const email = localStorage.getItem("email");
        setIsLoading(true);
        try {
            const employerData = await client.get(
              `/api/employer?email=${email}`
            );
            setEmployerName(employerData.data.name || "Nhà tuyển dụng");
            await auth.setEmployerData(employerData.data);
            
            const postIds = employerData.data?.data?.jobPosted || [];

            console.log("Danh sách postIds cần tải:", postIds);
            // Danh sách các Promise cho các bài đăng CẦN TẢI MỚI
            const fetchPromises = [];
            // Danh sách bài đăng cuối cùng để cập nhật state (bao gồm cả từ cache)
            const finalJobPosts = [];

            for (const postId of postIds) {
                if (postCache.current.has(postId)) {
                    // 1. Nếu đã có trong cache: Dùng dữ liệu cũ
                    finalJobPosts.push(postCache.current.get(postId));
                } else {
                    // 2. Nếu chưa có: Tạo Promise để tải và đưa vào danh sách chờ
                    const fetchPromise = client.get(`/api/post-job?jobId=${postId}`)
                        .then(response => {
                          if (!response.data.success){
                            return null;
                          }
                            const post = response.data.data;
                            // Cập nhật cache ngay sau khi fetch thành công
                            postCache.current.set(postId, post); 
                            return post; // Trả về dữ liệu bài đăng
                        });
                    fetchPromises.push(fetchPromise);
                }
            }
            // 3. Chờ tất cả các API CẦN THIẾT hoàn thành
            const newJobPosts = await Promise.all(fetchPromises);
            const validNewPosts = newJobPosts.filter(post => post !== null);
            console.log("Bài đăng mới tải về:", validNewPosts);           
            setJobPosts([...finalJobPosts, ...newJobPosts]);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dashboard:", error);
        } finally {
            setIsLoading(false);
        }
  };

  useEffect(() => {
    loadDashboardData(); // Chạy hàm
  }, [auth.user]);

  const tabNameMap = {
    CVManage: "Quản lý CV",
    ManagePosts: "Quản lý bài đăng",
    CVPost: "Đăng tin tuyển dụng",
    About: "Về chúng tôi",
    Renew: "Gia hạn",
    Logout: "Đăng xuất",
    Profile: "Tài khoản",
  };
  
  const handlePostSubmit = async (postData) => {
    setIsLoading(true);

    try {
      const email = localStorage.getItem("email");
      const company = auth.employerData?.data?.company || "Công ty chưa đặt tên";

      if (!company) {
        alert("Vui lòng cập nhật tên công ty trong hồ sơ trước khi đăng tin tuyển dụng.");
        setIsLoading(false);
        return;
      }

      const finalData = {
        ...postData,
        company: company,
      }

      const response = await client.post(`/api/post-job?email=${email}`, finalData);

      if (response.data.success) {
        alert("Đăng tin tuyển dụng thành công!");
      } else {
        alert("Đăng tin tuyển dụng thất bại: " + response.data.message);
      }

      await loadDashboardData();
      
      setEditingPost(null); // Xóa trạng thái "đang sửa"
      setActiveSetting("ManagePosts"); // Chuyển về trang Quản lý

    } catch (error) {
      console.error("Lỗi khi đăng/sửa bài:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại."); 
      setIsLoading(false); // Tắt loading nếu lỗi
    }
    
  };

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
          <TopNavButton icon={HiLogout} label="Đăng xuất" onClick={() => { auth.logout(); navigate("/login")}} /> {/* <--- SỬA Ở ĐÂY */}
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
            {isLoading ? (
              <div className="card">
                <h3>Đang tải dữ liệu...</h3>
              </div>
            ) : (
            <>

            {activeSetting === null && (
              <h1 className="title">Chọn một cài đặt để xem nội dung</h1>
            )}

            {activeSetting === "CVManage" && (
              <div style={{ paddingTop: 10 }}>
                <CVManage 
                  jobPosts={jobPosts}
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