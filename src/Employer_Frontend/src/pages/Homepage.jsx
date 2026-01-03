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
import toast from 'react-hot-toast';

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
        toast.error("Vui lòng cập nhật tên công ty trong hồ sơ trước khi đăng tin.");
        return;
    }
    postData.companyEmail = localStorage.getItem("email");
    setPendingPostData(postData); // Lưu tạm
    setPostDuration(7); // Reset về mặc định
    setShowPaymentModal(true); // Mở Modal
  };

  // --- BƯỚC 2: XÁC NHẬN THANH TOÁN & GỌI API ---
  const handleConfirmPayment = async () => {
    if (!postDuration || parseInt(postDuration) < 1) {
        toast.error("Vui lòng nhập thời hạn đăng bài (tối thiểu 1 ngày).");
        return;
    }
    if (!canAfford) {
        toast.error("Số dư không đủ. Vui lòng nạp thêm tiền.");
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
        toast.success(`Đăng tin thành công! Bạn đã bị trừ ${totalCost} điểm.`);
        // Cập nhật lại điểm ngay lập tức trên UI (nếu API trả về điểm mới)
        if (response.data.remainingPoint !== undefined) {
             const currentData = auth.getEmployerData();
             auth.setEmployerData({
                 ...currentData,
                 data: { ...currentData.data, point: response.data.remainingPoint }
             });
        }
      } else {
        toast.error("Đăng tin thất bại: " + response.data.message);
      }

      await loadDashboardData();
      setEditingPost(null);
      setActiveSetting("ManagePosts");

    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại."); 
    } finally {
        setIsLoading(false);
        setPendingPostData(null);
    }
  };

  const updateJobLocal = (updatedJob) => {
        setJobPosts((prevPosts) => {
            // Kiểm tra an toàn: nếu prevPosts không phải mảng thì trả về mảng chứa job mới
            if (!Array.isArray(prevPosts)) return [updatedJob];

            // Duyệt mảng cũ, tìm job trùng ID để thay thế, còn lại giữ nguyên
            return prevPosts.map((post) => 
                post._id === updatedJob._id ? updatedJob : post
            );
        });
    };

  // Hàm Update bài đăng (Logic cũ, không trừ tiền khi edit thông tin)
  const handleUpdatePost = async (updatedData) => {
    setIsLoading(true);
    try {
      if (!updatedData.id) {
        toast.error("Thiếu ID bài đăng để cập nhật!");
        setIsLoading(false); return;
      }
      console.log(updatedData)
      const response = await client.patch(`/api/post-job?jobId=${updatedData.id}`, updatedData);

      if (response.data.success) {
        toast.success("Cập nhật bài đăng thành công!");
        setJobPosts((prevPosts) =>
            prevPosts.map((post) => post._id === updatedData.id ? { ...post, ...updatedData } : post)
        );
        setEditingPost(null);
        setActiveSetting("ManagePosts");
      } else {
        toast.error("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật.");
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
          toast.success("Cập nhật bài đăng thành công!");
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
            toast.success("Xóa bài đăng thành công!");
            setJobPosts((prevPosts) => prevPosts.filter((p) => p._id !== postIdToDelete));
        } else {
            toast.error("Xóa bài đăng thất bại: " + result.data.message);
        }
    } catch (error) {
        console.error("Lỗi khi xóa bài đăng:", error);
        toast.error("Xóa bài đăng thất bại!");
        setJobPosts(previousJobPosts);
    }
  };
  
  const handlePostNavClick = () => {
    setEditingPost(null); 
    setActiveSetting("PostJob");
  };
  
  // Hàm lấy chữ cái đầu (VD: "Bát Quái" -> "BQ")
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    // Lấy chữ cái đầu của từ đầu tiên và từ cuối cùng
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Lấy dữ liệu logo GỐC (không lấy ảnh mặc định monoLogo nữa để check)
  const rawLogoUrl = auth.auth.employerData?.data?.logo?.url;
  const companyName = auth.auth.employerData?.data?.company || "Employer";

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
                {rawLogoUrl ? (
                    <img src={rawLogoUrl} alt="User Avatar" className="user-avatar" />
                ) : (
                    <div className="avatar-placeholder-init user-avatar placeholder">
                        {getInitials(companyName)}
                    </div>
                )}
                <div className="user-details">
                    <div className="user-info">{auth.getEmployerData()?.data?.company || "Công ty chưa đặt tên"}</div>
                    {/* Hiển thị điểm ở Sidebar luôn cho tiện theo dõi */}
                    <div className="user-info" style={{color: '#2563eb', fontWeight: 'bold'}}>
                        {currentPoints.toLocaleString()} ĐIỂM
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
                <div className="card"><h3></h3></div>
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
                    updateJobLocal={updateJobLocal}
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
            <div className="payment-modal">
                <div className="payment-header">
                    <h2>Xác nhận đăng tin</h2>
                    <p className="payment-desc">Chọn thời hạn hiển thị để bài đăng của bạn tiếp cận ứng viên tốt nhất.</p>
                </div>
                
                <div className="balance-box">
                    <span className="balance-label">Số dư hiện tại:</span>
                    <span className={`balance-value ${!canAfford ? 'error' : ''}`}>
                        {currentPoints.toLocaleString()} điểm
                    </span>
                </div>

                <div className="duration-input-group">
                    <label className="duration-label">Thời hạn đăng (ngày):</label>
                    <input 
                        type="number" 
                        min="1" max="365"
                        className="duration-input"
                        value={postDuration.toString()}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Nếu xóa hết thì để rỗng, ngược lại ép về số nguyên (tự mất số 0 đầu)
                            if (val === "") {
                                setPostDuration("");
                            } else {
                                setPostDuration(parseInt(val, 10)); 
                            }
                        }}
                        
                    />
                    <div className="unit-hint">Đơn giá: {COST_PER_DAY} điểm / ngày</div>
                </div>

                {!canAfford && (
                    <div className="error-noti">
                        ⛔ Số dư không đủ! Bạn còn thiếu {(totalCost - currentPoints).toLocaleString()} điểm.
                    </div>
                )}

                <div className="total-row">
                    <span className="total-label">Tổng cộng:</span>
                    <span className="total-price">{totalCost.toLocaleString()} điểm</span>
                </div>

                <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowPaymentModal(false)}>
                        Hủy bỏ
                    </button>
                    
                    {canAfford ? (
                        <button className="btn-pay" onClick={handleConfirmPayment}
                        disabled={!postDuration || parseInt(postDuration) < 1}
                          style={{
                              padding: '10px 20px', borderRadius: '8px', border: 'none',
                              // Đổi màu xám nếu disabled
                              background: (!postDuration || parseInt(postDuration) < 1) ? '#9ca3af' : '#2563eb', 
                              color: 'white', cursor: (!postDuration || parseInt(postDuration) < 1) ? 'not-allowed' : 'pointer', 
                              fontWeight: 600
                          }}
                        >
                            Thanh toán & Đăng
                        </button>
                    ) : (
                        <button 
                            className="btn-pay" 
                            style={{background: '#059669'}} // Màu xanh lá cho nút Nạp tiền
                            onClick={() => { setShowPaymentModal(false); setActiveSetting("Donate"); }}
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
