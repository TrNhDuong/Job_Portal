import React, { useState, useEffect, useMemo } from "react";
import PointDisplay from "../components/PointDisplay";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCalendar, HiOutlineUsers, HiExclamationCircle, HiX, HiCheck, HiClock } from "react-icons/hi";
import "../styles/employerJobRenewal.css";
import toast from 'react-hot-toast';
import client from "../api/client";

const POINTS_PER_DAY = 10;
const MAX_DAYS = 90;

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString("vi-VN"); 
}

const calculateNewExpirationDate = (currentExpireDateStr, daysToRenew) => {
    const now = new Date();
    
    const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    
    let baseDate;

    if (!currentExpireDateStr) {
        baseDate = todayUTC;
    } else {
        const currentExpire = new Date(currentExpireDateStr);
        const currentExpireUTC = new Date(
            Date.UTC(currentExpire.getFullYear(), currentExpire.getMonth(), currentExpire.getDate())
        );
        
        if (currentExpireUTC.getTime() < todayUTC.getTime()) {
            baseDate = todayUTC;
        } else {
            baseDate = currentExpireUTC;
        }
    }
    baseDate.setUTCDate(baseDate.getUTCDate() + daysToRenew);

    return baseDate;
};

const getDaysRemaining = (expireDateStr) => {
    if (!expireDateStr) return 0;

    const expireDate = new Date(expireDateStr);
    
    const now = new Date();
    const expireUTC = new Date(expireDate.getUTCFullYear(), expireDate.getUTCMonth(), expireDate.getUTCDate());

    // Lấy Ngày Hiện Tại (Today) ở dạng UTC
    const todayUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    const diffTime = expireUTC.getTime() - todayUTC.getTime();
    
    // Hằng số cho 1 ngày
    const oneDay = 1000 * 60 * 60 * 24;

    // 5. Tính số ngày và làm tròn
    return Math.ceil(diffTime / oneDay);
};


// 👇 NHẬN PROP jobPosts TỪ CHA (HOMEPAGE)
const EmployerJobRenewal = ({ onNavigateToDeposit, jobPosts, updateJobLocal }) => {
  const { auth, handleTransaction } = useAuth();
  console.log(jobPosts)
  // State Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [days, setDays] = useState(1);
  const [totalCost, setTotalCost] = useState(POINTS_PER_DAY)

  const sourceData = jobPosts && jobPosts.length > 0 ? jobPosts : [];

  console.log(auth)
  // --- LOGIC XỬ LÝ & SẮP XẾP ---
  const processedJobs = useMemo(() => {
    // 1. Gắn thêm thông tin trạng thái cho từng job
    const jobsWithStatus = sourceData.map(job => {
  
        const daysLeft = getDaysRemaining(job?.expireDay);
        let status = 'active'; // Mặc định xanh
        let label = `Còn ${daysLeft} ngày`;

        if (daysLeft < 0) {
            status = 'expired';
            label = 'Đã hết hạn';
        } else if (daysLeft <= 3) {
            status = 'urgent'; // Sắp hết hạn
            label = `Sắp hết hạn (${daysLeft} ngày)`;
        }

        return { ...job, daysLeft, status, label };
    });

    // 2. Sắp xếp: Expired -> Urgent -> Active
    return jobsWithStatus.sort((a, b) => {
        const priority = { expired: 0, urgent: 1, active: 2 };
        // So sánh theo nhóm trước
        if (priority[a.status] !== priority[b.status]) {
            return priority[a.status] - priority[b.status];
        }
        return a.daysLeft - b.daysLeft;
    });
  }, [sourceData]);


  useEffect(() => {
    setTotalCost(days * POINTS_PER_DAY);
  }, [days]);

  // Hàm xử lý nhập số ngày an toàn
  const handleDayChange = (e) => {
    let val = parseInt(e.target.value);
    
    if (isNaN(val)) val = 0; // Tạm thời để 0 để user xóa được số, sẽ chặn lúc submit hoặc onBlur
    
    // Nếu nhập quá lớn, chặn ngay lập tức
    if (val > MAX_DAYS) val = MAX_DAYS;
    
    setDays(val);
  };

  // Hàm xử lý khi rời khỏi ô input (onBlur) để đảm bảo số luôn hợp lệ
  const handleBlur = () => {
    let val = days;
    if (val < 1) val = 1;
    if (val > MAX_DAYS) val = MAX_DAYS;
    setDays(val);
  };

  const openRenewalModal = (job) => {
    setSelectedJob(job);
    setDays(1);
  };

  const closeRenewalModal = () => {
    setSelectedJob(null);
  };

  const handleConfirmRenewal = async () => {   
    if (days < 1 || days > MAX_DAYS) {
        toast.error(`Số ngày gia hạn phải từ 1 đến ${MAX_DAYS}`);
        return;
    }

    if (auth.employerData.data.point < totalCost) {
      toast.error("Không đủ điểm! Vui lòng nạp thêm.");
      if (onNavigateToDeposit) onNavigateToDeposit();
      return;
    }

    if (window.confirm(`Xác nhận gia hạn ${days} ngày cho bài viết này?`)) {
      let newExpireDay = undefined;
      newExpireDay = calculateNewExpirationDate(selectedJob.expireDay, days);
      console.log('New expireDay', newExpireDay)
     try {
      const email = auth.employerData.data.email;
      const res = await client.patch(`api/post-job/extend?jobId=${selectedJob._id}&email=${email}`,
        {expireDay: newExpireDay, point: totalCost}
      );
      if (res.data.success){
        // Logic Mock UI
        handleTransaction(totalCost, "remove");
        toast.success(`Đã gia hạn "${selectedJob.title}" thêm ${days} ngày!`);
        const updatedJob = {
            ...selectedJob,
            expireDay: newExpireDay,
            state: "Open"
        };

        // 1. cập nhật local ngay lập tức
    
        closeRenewalModal();
        updateJobLocal(updatedJob);
      }
     } catch (error){

     }
      
      // Ở đây sau này cần gọi hàm reloadData() từ cha để cập nhật lại list
    }
  };

  for (const job of processedJobs) {
    console.log(job.expireDay);
  }
  
  return (
    <div className="renewal-page">
      <PointDisplay points={auth.employerData.data.point} />
      
      <div className="renewal-container">
        <div className="renewal-header">
            <h3><HiClock className="icon-header" style={{color: '#0061ff'}}/> Quản lý thời hạn tin đăng</h3>
            <p className="sub-text">Theo dõi và gia hạn các bài đăng để duy trì hiển thị với ứng viên.</p>
        </div>

        <div className="job-grid">
          {processedJobs.map((job) => (
            <div key={job.id || job._id || index} className={`job-card status-${job.status}`}>
              {/* Dải trạng thái có màu thay đổi theo status */}
              <div className={`status-strip ${job.status}`}>
                  {job.label}
              </div>
              
              <h4 className="job-title" title={job.title}>{job.title}</h4>
              
              <div className="job-meta">
                  <div className={`meta-item ${job.status === 'expired' ? 'expire-text' : ''}`}>
                      <HiOutlineCalendar /> <span>{formatDate(job.expireDay)}</span>
                  </div>
                  <div className="meta-item">
                      <HiOutlineUsers /> <span>{job.applicants.length} ứng viên</span>
                  </div>
              </div>

              <button className="btn-renew-action" onClick={() => openRenewalModal(job)}>
                  Gia hạn ngay
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL GIA HẠN GIỮ NGUYÊN --- */}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeRenewalModal}>
            <div className="renewal-modal" onClick={e => e.stopPropagation()}>
                <button className="btn-close" onClick={closeRenewalModal}><HiX /></button>
                <h4>Gia hạn bài đăng</h4>
                <p className="job-name-modal">{selectedJob.title}</p>

                <div className="renewal-form">
                    <label>Số ngày gia hạn thêm (tối đa: {MAX_DAYS} ngày)</label>
                    <div className="input-row">
                        <input 
                            type="number" min="1" max= {MAX_DAYS}
                            value={days.toString()} 
                            onChange={handleDayChange}
                            onBlur={handleBlur}
                        />
                        <span className="unit-text">ngày</span>
                    </div>
                    <input 
                        type="range" min="1" max= {MAX_DAYS} value={days || 1} 
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="range-slider"
                    />
                    <div className="cost-summary">
                        <span>Chi phí:</span>
                        <strong className="cost-value">{(days || 0) * POINTS_PER_DAY} điểm</strong>
                    </div>
                    <p className="rate-note">({POINTS_PER_DAY} điểm / 1 ngày)</p>
                </div>

                <button className="btn-confirm-renew" onClick={handleConfirmRenewal}>
                    <HiCheck /> Xác nhận thanh toán
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmployerJobRenewal;