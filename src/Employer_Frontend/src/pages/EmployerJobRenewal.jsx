import React, { useState, useEffect, useMemo } from "react";
import PointDisplay from "../components/PointDisplay";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCalendar, HiOutlineUsers, HiExclamationCircle, HiX, HiCheck, HiClock } from "react-icons/hi";
import "../styles/employerJobRenewal.css";
import toast from 'react-hot-toast';

const POINTS_PER_DAY = 10;
const MAX_DAYS = 90;

// Helper: Chuyển đổi string "dd/mm/yyyy" sang Date object
const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
};

// Helper: Tính số ngày còn lại
const getDaysRemaining = (expireDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset giờ về 0 để so sánh chính xác
  const expire = parseDate(expireDateStr);
  const diffTime = expire - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
};

// 👇 NHẬN PROP jobPosts TỪ CHA (HOMEPAGE)
const EmployerJobRenewal = ({ onNavigateToDeposit, jobPosts }) => {
  const { auth, handleTransaction } = useAuth();
  
  // State Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [days, setDays] = useState(1);
  const [totalCost, setTotalCost] = useState(POINTS_PER_DAY);

  // Dữ liệu giả lập (Nếu chưa có API/Props từ cha thì dùng cái này test)
  const mockAllJobs = [
    { id: 1, title: "Senior React Developer", expireDate: "20/11/2025", applicants: 12 }, // Đã qua (Giả sử nay là sau 20/11)
    { id: 2, title: "Backend NodeJS Engineer", expireDate: "28/11/2025", applicants: 5 }, // Sắp hết
    { id: 3, title: "UI/UX Designer", expireDate: "30/12/2025", applicants: 8 }, // Còn lâu
    { id: 4, title: "Project Manager", expireDate: "10/11/2025", applicants: 20 }, // Đã qua
    { id: 5, title: "DevOps Engineer", expireDate: "01/12/2025", applicants: 3 }, // Sắp hết
    { id: 6, title: "Design Engineer", expireDate: "01/12/2025", applicants: 5 },
  ];

  // Sử dụng prop jobPosts nếu có, không thì dùng mock
  // Lưu ý: Sau này kết nối API ở Homepage rồi truyền xuống đây
  const sourceData = jobPosts && jobPosts.length > 0 ? jobPosts : mockAllJobs;

  // --- LOGIC XỬ LÝ & SẮP XẾP ---
  const processedJobs = useMemo(() => {
    // 1. Gắn thêm thông tin trạng thái cho từng job
    const jobsWithStatus = sourceData.map(job => {
        // Giả định ngày hiện tại để test logic (Bạn có thể bỏ dòng này khi chạy thật)
        // const mockToday = new Date("2025-11-25"); 
        
        const daysLeft = getDaysRemaining(job.expireDate);
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
        
        // Nếu cùng nhóm, so sánh số ngày còn lại (Tăng dần)
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

  const handleConfirmRenewal = () => {   
    if (days < 1 || days > MAX_DAYS) {
        toast.error(`Số ngày gia hạn phải từ 1 đến ${MAX_DAYS}`);
        return;
    }

    if (auth.points < totalCost) {
      toast.error("Không đủ điểm! Vui lòng nạp thêm.");
      if (onNavigateToDeposit) onNavigateToDeposit();
      return;
    }

    if (window.confirm(`Xác nhận gia hạn ${days} ngày cho bài viết này?`)) {
      // --- LOGIC API (Comment lại để sau này thêm) ---
      /*
      try {
          const res = await client.post('/api/job/renew', { 
              jobId: selectedJob.id, 
              days: days 
          });
          if (res.success) { ... }
      } catch (err) { ... }
      */
      
      // Logic Mock UI
      handleTransaction(totalCost, "remove");
      toast.success(`Đã gia hạn "${selectedJob.title}" thêm ${days} ngày!`);
      closeRenewalModal();
      // Ở đây sau này cần gọi hàm reloadData() từ cha để cập nhật lại list
    }
  };
  
  return (
    <div className="renewal-page">
      <PointDisplay points={auth.points} />
      
      <div className="renewal-container">
        <div className="renewal-header">
            <h3><HiClock className="icon-header" style={{color: '#0061ff'}}/> Quản lý thời hạn tin đăng</h3>
            <p className="sub-text">Theo dõi và gia hạn các bài đăng để duy trì hiển thị với ứng viên.</p>
        </div>

        <div className="job-grid">
          {processedJobs.map((job) => (
            <div key={job.id} className={`job-card status-${job.status}`}>
              {/* Dải trạng thái có màu thay đổi theo status */}
              <div className={`status-strip ${job.status}`}>
                  {job.label}
              </div>
              
              <h4 className="job-title" title={job.title}>{job.title}</h4>
              
              <div className="job-meta">
                  <div className={`meta-item ${job.status === 'expired' ? 'expire-text' : ''}`}>
                      <HiOutlineCalendar /> <span>Hết hạn: {job.expireDate}</span>
                  </div>
                  <div className="meta-item">
                      <HiOutlineUsers /> <span>{job.applicants} ứng viên</span>
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