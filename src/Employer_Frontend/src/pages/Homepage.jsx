// frontend/src/pages/Homepage.jsx
import React, { useRef, useState, useContext, useEffect } from "react"; // <--- SỬA: Thêm useContext
import "../App.css";
import { HiMenu, HiShoppingCart, HiX, HiUser, HiInformationCircle, HiDocumentAdd, HiLogout, HiUserGroup, HiOutlineBriefcase } from "react-icons/hi"; 
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
import Setting from "./Setting.jsx";
import logoImage from "../assets/logo.png"; 
import monoLogo from "../assets/mono-logo.png";
import { HiOutlineCog } from 'react-icons/hi';
import { HiOutlineInformationCircle, HiOutlineCreditCard, HiArrowPath } from 'react-icons/hi2';

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
    const email = auth.employerData?.data?.email || localStorage.getItem("email");
    setIsLoading(true);

    try {
        const employerData = await client.get(`/api/employer?email=${email}`);
        setEmployerName(employerData.data.name || "Nhà tuyển dụng");

        await auth.setEmployerData(employerData.data);

        const postIds = employerData.data?.data?.jobPosted || [];
        console.log("Danh sách postIds cần tải:", postIds);

        const fetchPromises = [];
        const finalJobPosts = [];

        for (const postId of postIds) {

            // Nếu cache đã có → dùng cache
            if (postCache.current.has(postId)) {
                finalJobPosts.push(postCache.current.get(postId));
                continue;
            }

            // Tạo promise KHÔNG BAO GIỜ THROW
            const fetchPromise = client
                .get(`/api/post-job?jobId=${postId}`)
                .then((res) => {
                    if (!res.data.success) return null;

                    const post = res.data.data;
                    postCache.current.set(postId, post);
                    return post;
                })
                .catch((err) => {
                    console.warn(
                        `Lỗi tải postId ${postId}:`,
                        err.response?.data || err.message
                    );
                    return null; // Không throw → Promise.all không bị reject
                });

            fetchPromises.push(fetchPromise);
        }

        // CHỈ chứa các promise "safe", không lỗi
        const newJobPosts = await Promise.all(fetchPromises);

        // Loại bỏ null
        const validPosts = newJobPosts.filter((p) => p !== null);

        console.log("Bài đăng mới tải về:", validPosts);

        // Gộp cache + bài mới
        setJobPosts([...finalJobPosts, ...validPosts]);

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
    PostJob: "Đăng tin tuyển dụng",
    About: "Về chúng tôi",
    Renew: "Gia hạn",
    Donate: "Nạp tiền",
    Logout: "Đăng xuất",
    Setting: "Cài đặt",
    Profile: "Tài khoản",
  };
  
  const handleCreatePost = async (postData) => {
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

  const handleUpdatePost = async (updatedData) => {
    setIsLoading(true);
    console.log("Dữ liệu bài đăng cần cập nhật:", updatedData);
    try {
      
      if (!updatedData.id) {
        alert("Thiếu ID bài đăng để cập nhật!");
        setIsLoading(false);
        return;
      }

      const response = await client.patch(
        `/api/post-job?jobId=${updatedData.id}`, updatedData
      );

      if (response.data.success) {
        alert("Cập nhật bài đăng thành công!");

        setJobPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === updatedData.id ? { ...post, ...updatedData } : post
            )
          );  // reload lại danh sách
        setEditingPost(null);        // thoát chế độ sửa
        setActiveSetting("ManagePosts");
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }

    } catch (error) {
      console.error("Lỗi khi cập nhật bài đăng:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }

    setIsLoading(false);
  };


  const handleProfileUpdate = (newName) => {
    setEmployerName(newName);
  };

  const handleEditClick = (postToEdit) => {
    setEditingPost(postToEdit);
    setActiveSetting("PostJob");
  };

  const handleDeletePost = async (postIdToDelete) => {
    // BƯỚC 1: Lấy state hiện tại (để khôi phục nếu lỗi)
    const previousJobPosts = jobPosts;
    const email = auth.employerData?.data?.email || localStorage.getItem("email");
    // // BƯỚC 2: Cập nhật giao diện ngay lập tức (để người dùng thấy nhanh)
    // setJobPosts((prevPosts) =>
    //     prevPosts.filter((p) => p._id !== postIdToDelete)
    // );

    // BƯỚC 3: Gọi API để xóa thật trong CSDL
    try {
        // Chúng ta dùng _id (postIdToDelete) để gọi API
        const result = await client.delete(`/api/post-job?jobId=${postIdToDelete}&email=${email}`);
        
        if (result.data.success) {
            alert("Xóa bài đăng thành công!");
            setJobPosts((prevPosts) =>
              prevPosts.filter((p) => p._id !== postIdToDelete)
            );
        } else {
            // Nếu API trả về lỗi (ví dụ: bài đăng không tồn tại)
            alert("Xóa bài đăng thất bại: " + result.data.message);
        }

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
    setActiveSetting("PostJob");
  };
  
  return (
    <div>

      <div className="page-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "17.5% 1fr",
            transition: "grid-template-columns 0.3s ease",
          }}>

        <div className="side-bar">

          <div className="sidebar-top-section">
            <div className="user-info-area" onClick={() => setActiveSetting("Profile")} >
                <img src={monoLogo} alt="User Avatar" className="user-avatar" />
                <div className="user-details">
                    <div className="user-info">{auth.getEmployerData()?.data?.company || "Công ty chưa đặt tên"}</div>
                    <div className="user-info">{auth.getEmployerData()?.data?.email || "email@cua.ban"}</div>
                </div>
                
            </div>

            {/* Đường phân cách cuối (Optional) */}
            <hr className="header-divider" /> 
        </div>

          {/* <div className="sidebar-header">
              <div className="logo-container">
                  <img src={logoImage} alt="Logo" className="sidebar-logo-small" />
                  <span className="app-acronym">TND</span>
              </div>
          </div> */}

          <div className="sidebar-menu">
            <li className="menu-header">Tuyển dụng</li>
            <NavItem
              icon={<HiUserGroup />}
              label="Quản lý ứng viên"
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
              icon={<HiDocumentAdd />}
              label="Đăng tin tuyển dụng"
              onClick={handlePostNavClick}
              isActive={activeSetting === "PostJob"}
            />
            <li className="menu-header">Giao dịch</li>
            <NavItem
              icon={<HiArrowPath />}
              label="Gia hạn bài đăng"
              onClick={() => setActiveSetting("Renew")}
              isActive={activeSetting === "Renew"}
            />
            <NavItem
              icon={<HiOutlineCreditCard />}
              label="Nạp tiền"
              onClick={() => setActiveSetting("Donate")}
              isActive={activeSetting === "Donate"}
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
              onClick={() => setActiveSetting("Setting")}
              isActive={activeSetting === "Setting"}
            />

            <NavItem
              icon={<HiLogout />}
              label="Đăng xuất"
              onClick={() => { auth.logout(); navigate("/login"); }}
            />
          </div>
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

          <div style={{ marginTop: "80px" }}>
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
              <div>
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

            {activeSetting === "PostJob" && (
              <div style={{ paddingTop: 10 }}>
                <EmployerPostJob
                  onSubmit={editingPost ? handleUpdatePost : handleCreatePost}
                  initialData={editingPost}
                />
              </div>
            )}

            {activeSetting === "Profile" && (
              <div style={{ paddingTop: 10 }}>
                <EmployerProfile 
                  onProfileUpdate={handleProfileUpdate} 
                  data={auth.getEmployerData().data}
                />
              </div>
            )}

            {activeSetting === "About" && (
              <div style={{ paddingTop: 10 }}>
                <AboutPage />
              </div>
            )}

            {activeSetting === "Setting" && (
              <Setting 
                isVisible={true}
                onClose={() => setActiveSetting(null)}
              />
            )}
            </>
            )}
          </div>
        </div>
    </div>
  </div>
  );
}