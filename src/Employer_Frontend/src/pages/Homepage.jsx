// frontend/src/pages/Homepage.jsx
import React, { useRef, useState, useContext, useEffect } from "react";
import "../App.css";
import { HiLogout, HiOutlineBriefcase } from "react-icons/hi"; 
import { AuthContext } from "../context/AuthContext.jsx"; 
import client from "../api/client.js";
import { useNavigate } from "react-router-dom";
import NavItem from "../components/NavItem.jsx";
import EmployerPostJob from "./EmployerPostJob.jsx";
import CVManage from "./employerManage.jsx"; 
import EmployerProfile from "./employerProfile.jsx";
import EmployerManagePosts from "./EmployerManagePosts.jsx"; 
import AboutPage from "./AboutPage.jsx";
import Setting from "./Setting.jsx";
import logoImage from "../assets/logo.png"; 
import monoLogo from "../assets/mono-logo.png";
import { HiOutlineCog } from 'react-icons/hi';
import { HiOutlineInformationCircle, HiOutlineCreditCard, HiArrowPath } from 'react-icons/hi2';

//THANH TOÁN
import EmployerDeposit from "./EmployerDeposit.jsx";
import EmployerJobRenewal from "./EmployerJobRenewal.jsx";
import postIcon from '../assets/icon/post.png';
import candidateIcon from '../assets/icon/candidate.png';

export default function Homepage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const postCache = useRef(new Map()); 
  const logoUrl = auth.auth.employerData?.data.logo?.url || monoLogo;
  
  // State quản lý Tab
  const [activeSetting, setActiveSetting] = useState("ManagePosts");
  const [preSetting, setPreSetting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobPosts, setJobPosts] = useState([])
  const [editingPost, setEditingPost] = useState(null);
  const [employerName, setEmployerName] = useState("");

  // --- STATE CHO THANH TOÁN ĐĂNG BÀI ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [postDuration, setPostDuration] = useState(7); // Mặc định 7 ngày
  const [pendingPostData, setPendingPostData] = useState(null); // Dữ liệu chờ thanh toán

  // Lấy điểm hiện tại từ Context
  const currentPoints = auth.getEmployerData()?.data?.point || 0;
  const COST_PER_DAY = 10;
  const totalCost = postDuration * COST_PER_DAY;
  const canAfford = currentPoints >= totalCost;

  const loadDashboardData = async () => {
    const email = auth.auth.employerData?.data?.email || localStorage.getItem("email");
    setIsLoading(true);

    try {
        const employerData = await client.get(`/api/employer?email=${email}`);
        setEmployerName(employerData.data.name || "Nhà tuyển dụng");

        await auth.setEmployerData(employerData.data);

        const postIds = employerData.data?.data?.jobPosted || [];
        const fetchPromises = [];
        const finalJobPosts = [];

        for (const postId of postIds) {
            if (postCache.current.has(postId)) {
                finalJobPosts.push(postCache.current.get(postId));
                continue;
            }
            const fetchPromise = client
                .get(`/api/post-job/id?jobId=${postId}`)
                .then((res) => {
                    if (!res.data.success) return null;
                    const post = res.data.data;
                    postCache.current.set(postId, post);
                    return post;
                })
                .catch((err) => null);

            fetchPromises.push(fetchPromise);
        }

        const newJobPosts = await Promise.all(fetchPromises);
        const validPosts = newJobPosts.filter((p) => p !== null);
        setJobPosts([...finalJobPosts, ...validPosts]);

    } catch (error) {
          console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
          setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [auth.user]);

  const tabNameMap = {
    CVManage: "Quản lý ứng viên",
    ManagePosts: "Quản lý bài đăng",
    PostJob: "Đăng tin tuyển dụng",
    About: "Về chúng tôi",
    Renew: "Gia hạn",
    Donate: "Nạp tiền",
    Logout: "Đăng xuất",
    Setting: "Cài đặt",
    Profile: "Tài khoản",
  };
  
  // --- BƯỚC 1: NHẬN DỮ LIỆU TỪ FORM -> MỞ MODAL ---
  const handlePreCreatePost = (postData) => {
    const company = auth.auth.employerData?.data?.company;
    if (!company) {
        alert("Vui lòng cập nhật tên công ty trong hồ sơ trước khi đăng tin.");
        return;
    }
    setPendingPostData(postData); // Lưu tạm
    setPostDuration(7); // Reset về mặc định
    setShowPaymentModal(true); // Mở Modal
  };

  // --- BƯỚC 2: XÁC NHẬN THANH TOÁN & GỌI API ---
  const handleConfirmPayment = async () => {
    if (!canAfford) {
        alert("Số dư không đủ. Vui lòng nạp thêm tiền.");
        return;
    }
    if (!pendingPostData) return;

    setIsLoading(true);
    setShowPaymentModal(false); // Đóng modal

    try {
      const email = localStorage.getItem("email");
      const company = auth.auth.employerData?.data?.company;

      // Tính ngày hết hạn
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + parseInt(postDuration));

      const finalData = {
        ...pendingPostData,
        company: company,
        point: totalCost, // Gửi số điểm cần trừ
        expiredDay: expiredDate, // Gửi ngày hết hạn
      }

      const response = await client.post(`/api/post-job?email=${email}`, finalData);

      if (response.data.success) {
        alert(`Đăng tin thành công! Bạn đã bị trừ ${totalCost} điểm.`);
        // Cập nhật lại điểm ngay lập tức trên UI (nếu API trả về điểm mới)
        if (response.data.remainingPoint !== undefined) {
             const currentData = auth.getEmployerData();
             auth.setEmployerData({
                 ...currentData,
                 data: { ...currentData.data, point: response.data.remainingPoint }
             });
        }
      } else {
        alert("Đăng tin thất bại: " + response.data.message);
      }

      await loadDashboardData();
      setEditingPost(null);
      setActiveSetting("ManagePosts");

    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại."); 
    } finally {
        setIsLoading(false);
        setPendingPostData(null);
    }
  };

  // Hàm Update bài đăng (Logic cũ, không trừ tiền khi edit thông tin)
  const handleUpdatePost = async (updatedData) => {
    setIsLoading(true);
    try {
      if (!updatedData.id) {
        alert("Thiếu ID bài đăng để cập nhật!");
        setIsLoading(false); return;
      }
      console.log(updatedData)
      const response = await client.patch(`/api/post-job?jobId=${updatedData.id}`, updatedData);

      if (response.data.success) {
        alert("Cập nhật bài đăng thành công!");
        setJobPosts((prevPosts) =>
            prevPosts.map((post) => post._id === updatedData.id ? { ...post, ...updatedData } : post)
        );
        setEditingPost(null);
        setActiveSetting("ManagePosts");
      } else {
        alert("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Đã xảy ra lỗi khi cập nhật.");
    }
    setIsLoading(false);
  };
  
  const handleUpdateState = async (updatePost) => {
    try {        
        // Gọi API
        const newState = updatePost.state;
        const id = updatePost._id;
        const response = await client.patch(`api/post-job/state?jobId=${id}&state=${newState}`);
        if (response.data.success){
          alert("Cập nhật bài đăng thành công!");
          setJobPosts((prevPosts) =>
          prevPosts.map((post) => post._id === id? { ...post, ...updatePost } : post)
        );
        }
    } catch (err){
      console.error("Lỗi cập nhật trạng thái:", err);
      loadDashboardData(); // Revert nếu lỗi
    }
  }

  const handleProfileUpdate = (newName) => {
    setEmployerName(newName);
  };

  const handleEditClick = (postToEdit) => {
    setEditingPost(postToEdit);
    setActiveSetting("PostJob");
  };

  const handleDeletePost = async (postIdToDelete) => {
    const previousJobPosts = jobPosts;
    const email = auth.employerData?.data?.email || localStorage.getItem("email");
    try {
        const result = await client.delete(`/api/post-job?jobId=${postIdToDelete}&email=${email}`);
        if (result.data.success) {
            alert("Xóa bài đăng thành công!");
            setJobPosts((prevPosts) => prevPosts.filter((p) => p._id !== postIdToDelete));
        } else {
            alert("Xóa bài đăng thất bại: " + result.data.message);
        }
    } catch (error) {
        console.error("Lỗi khi xóa bài đăng:", error);
        alert("Xóa bài đăng thất bại!");
        setJobPosts(previousJobPosts);
    }
  };
  
  const handlePostNavClick = () => {
    setEditingPost(null); 
    setActiveSetting("PostJob");
  };
  
  return (
    <div>
      <div className="dashboard-theme">
        <div className="page-wrap"
            style={{
              display: "grid",
              gridTemplateColumns: "17.5% 1fr",
              transition: "grid-template-columns 0.3s ease",
            }}>

          {/* --- SIDEBAR --- */}
          <div className="side-bar">
          <div className="sidebar-top-section">
            <div className="user-info-area" onClick={() => setActiveSetting("Profile")} >
                <img src={logoUrl} alt="User Avatar" className="user-avatar" />
                <div className="user-details">
                    <div className="user-info">{auth.getEmployerData()?.data?.company || "Công ty chưa đặt tên"}</div>
                    {/* Hiển thị điểm ở Sidebar luôn cho tiện theo dõi */}
                    <div className="user-info" style={{color: '#2563eb', fontWeight: 'bold'}}>
                        {currentPoints.toLocaleString()} Points
                    </div>
                </div>
            </div>
            <hr className="header-divider" /> 
          </div>

          <div className="sidebar-menu">
            <li className="menu-header">Tuyển dụng</li>
            <NavItem
              icon={<img src={candidateIcon} alt="Candidate Icon" style={{ width: '1.8rem', marginRight: '-8px' }} />}
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
                icon={<img src={postIcon} alt="Post Icon" style={{ width: '1.2rem', marginRight: '0px' }} />}
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
                onClick={() => {setPreSetting(activeSetting); setActiveSetting("Setting")}}
                isActive={activeSetting === "Setting"}
              />
              <NavItem
                icon={<HiLogout />}
                label="Đăng xuất"
                onClick={() => { auth.logout(); navigate("/login"); }}
              />
            </div>
          </div>

           {/* --- RIGHT PANEL --- */}
          <div className="right-panel">
            <div className="tab-name-bar" style={{ left: "17.5%", width: "82.5%", transition: "left 0.3s ease" }}>
              {tabNameMap[activeSetting] || (activeSetting === "Profile" ? "Tài khoản" : "Cài đặt")}
            </div>

            <div style={{ marginTop: "100px" }}>
              {isLoading ? (
                <div className="card"><h3>Đang tải dữ liệu...</h3></div>
              ) : (
              <>
              {activeSetting === "CVManage" && (
                <CVManage jobPosts={jobPosts} />
              )}
              
              {activeSetting === "ManagePosts" && (
                <EmployerManagePosts
                  posts={jobPosts}
                  onEdit={handleEditClick}
                  onUpdateState={handleUpdateState} // Đã đổi tên prop cho khớp code mới
                  onDelete={handleDeletePost}
                />
              )}

              {activeSetting === "PostJob" && (
                <div style={{ paddingTop: 10 }}>
                  <EmployerPostJob
                    // Nếu đang Edit thì gọi handleUpdate, nếu Đăng mới thì gọi PreCreate
                    onSubmit={editingPost ? handleUpdatePost : handlePreCreatePost}
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

              {activeSetting === "About" && <div style={{ paddingTop: 10 }}><AboutPage /></div>}

              {activeSetting === "Renew" && (
                <div style={{ paddingTop: 10 }}>
                  <EmployerJobRenewal
                    onNavigateToDeposit={() => setActiveSetting("Donate")}
                    jobPosts={jobPosts}
                  />
                </div>
              )}

              {activeSetting === "Donate" && <div style={{ paddingTop: 10 }}><EmployerDeposit /></div>}

              {activeSetting === "Setting" && (
                <Setting isVisible={true} onClose={() => setActiveSetting(preSetting)} />
              )}
              </>
              )}
            </div>
          </div>
      </div>

      {/* --- PAYMENT MODAL (POPUP THANH TOÁN) --- */}
      {showPaymentModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 style={{marginTop:0, color: '#111827'}}>Xác nhận đăng tin</h2>
                <p>Vui lòng chọn thời hạn hiển thị cho bài đăng tuyển dụng này.</p>
                
                <div className="payment-info">
                    <div className="info-row">
                        <span>Số dư hiện tại:</span>
                        <strong style={{color: canAfford ? '#059669' : '#dc2626'}}>
                            {currentPoints.toLocaleString()} điểm
                        </strong>
                    </div>
                    
                    <div className="input-group" style={{margin: '20px 0'}}>
                        <label style={{display:'block', marginBottom: 8, fontWeight:500}}>Thời hạn đăng (ngày):</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="365"
                            value={postDuration}
                            onChange={(e) => setPostDuration(e.target.value)}
                            style={{
                                width: '100%', padding: '10px', 
                                border: '1px solid #d1d5db', borderRadius: '8px',
                                fontSize: '16px'
                            }}
                        />
                        <div style={{fontSize: '13px', color: '#6b7280', marginTop: 4}}>
                            Đơn giá: {COST_PER_DAY} điểm / ngày
                        </div>
                    </div>

                    <div className="info-row total-row" style={{
                        borderTop: '1px solid #e5e7eb', paddingTop: 15, marginTop: 15,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{fontSize: '16px'}}>Tổng thanh toán:</span>
                        <strong style={{fontSize: '20px', color: '#2563eb'}}>
                            {totalCost.toLocaleString()} điểm
                        </strong>
                    </div>

                    {!canAfford && (
                        <div style={{
                            backgroundColor: '#fee2e2', color: '#b91c1c', 
                            padding: '10px', borderRadius: '8px', marginTop: '15px', fontSize: '14px'
                        }}>
                            ⛔ Số dư không đủ! Bạn còn thiếu {(totalCost - currentPoints).toLocaleString()} điểm.
                        </div>
                    )}
                </div>

                <div className="modal-actions" style={{display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'flex-end'}}>
                    <button 
                        onClick={() => setShowPaymentModal(false)}
                        style={{
                            padding: '10px 20px', borderRadius: '8px', border: '1px solid #d1d5db',
                            background: 'white', cursor: 'pointer', fontWeight: 500
                        }}
                    >
                        Hủy bỏ
                    </button>
                    
                    {canAfford ? (
                        <button 
                            onClick={handleConfirmPayment}
                            style={{
                                padding: '10px 20px', borderRadius: '8px', border: 'none',
                                background: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            Thanh toán & Đăng
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setShowPaymentModal(false); setActiveSetting("Donate"); }}
                            style={{
                                padding: '10px 20px', borderRadius: '8px', border: 'none',
                                background: '#059669', color: 'white', cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            Nạp tiền ngay
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  </div>
  );
}
