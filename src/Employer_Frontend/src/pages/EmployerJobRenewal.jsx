import React, { useState, useEffect } from "react";
import PointDisplay from "../components/PointDisplay";
import { useAuth } from "../context/AuthContext";
import { HiOutlineCalendar, HiOutlineUsers, HiExclamationCircle, HiX, HiCheck } from "react-icons/hi";
import "../styles/employerJobRenewal.css";
import toast from 'react-hot-toast';

const POINTS_PER_DAY = 10; // Hằng số giá tiền

const EmployerJobRenewal = ({ onNavigateToDeposit }) => {
  const { auth, handleTransaction } = useAuth();
  
  // --- STATE CHO MODAL ---
  const [selectedJob, setSelectedJob] = useState(null); // Bài đang chọn
  const [days, setDays] = useState(1);                  // Số ngày muốn gia hạn
  const [totalCost, setTotalCost] = useState(POINTS_PER_DAY); // Tổng tiền

  const [expiredJobs, setExpiredJobs] = useState([
    { id: 1, title: "Senior React Developer", expireDate: "20/11/2025", applicants: 12 },
    { id: 2, title: "Backend NodeJS Engineer", expireDate: "19/11/2025", applicants: 5 },
    { id: 3, title: "UI/UX Designer", expireDate: "15/11/2025", applicants: 8 },
    { id: 4, title: "Project Manager", expireDate: "10/11/2025", applicants: 20 },
    { id: 5, title: "DevOps Engineer", expireDate: "05/11/2025", applicants: 3 },
    { id: 6, title: "Tester / QA", expireDate: "01/11/2025", applicants: 15 },
  ]);

  // Tự động tính lại tiền khi số ngày thay đổi
  useEffect(() => {
    setTotalCost(days * POINTS_PER_DAY);
  }, [days]);

  // Mở Modal
  const openRenewalModal = (job) => {
    setSelectedJob(job);
    setDays(1); // Reset về mặc định 1 ngày
  };

  // Đóng Modal
  const closeRenewalModal = () => {
    setSelectedJob(null);
  };

  // Xử lý thanh toán
  const handleConfirmRenewal = () => {
    if (auth.points < totalCost) {
      toast.error("Không đủ điểm! Vui lòng nạp thêm.");
      if (onNavigateToDeposit) onNavigateToDeposit();
      return;
    }

    if (window.confirm(`Xác nhận gia hạn ${days} ngày với giá ${totalCost} điểm?`)) {
      handleTransaction(totalCost, "remove");
      // Xóa bài khỏi danh sách (Giả lập đã gia hạn xong)
      setExpiredJobs(prev => prev.filter(job => job.id !== selectedJob.id));
      closeRenewalModal();
      toast.success(`Đã gia hạn bài đăng thêm ${days} ngày!`);
    }
  };

  return (
    <div className="renewal-page">
      <PointDisplay points={auth.points} />
      
      <div className="renewal-container">
        <div className="renewal-header">
            <h3><HiExclamationCircle className="icon-header"/> Bài đăng cần gia hạn</h3>
            <p className="sub-text">Gia hạn ngay để bài đăng tiếp tục hiển thị với ứng viên.</p>
        </div>

        <div className="job-grid">
          {expiredJobs.length === 0 ? (
             <div className="empty-state">
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" alt="Empty" width="100" style={{opacity: 0.6, marginBottom: 15}}/>
                <p>Tuyệt vời! Không có bài đăng nào bị hết hạn.</p>
             </div>
          ) : (
            expiredJobs.map((job) => (
              <div key={job.id} className="job-card">
                {/* Header thay đổi: Bỏ giá tiền cố định, thay bằng Status */}
                <div className="status-strip">Đã hết hạn</div>
                
                <h4 className="job-title" title={job.title}>{job.title}</h4>
                
                <div className="job-meta">
                    <div className="meta-item expire-info">
                        <HiOutlineCalendar /> <span>{job.expireDate}</span>
                    </div>
                    {/* Chỉ giữ lại Ứng viên */}
                    <div className="meta-item">
                        <HiOutlineUsers /> <span>{job.applicants} ứng viên</span>
                    </div>
                </div>

                {/* Button mở Modal thay vì gọi hàm trừ tiền ngay */}
                <button className="btn-renew-action" onClick={() => openRenewalModal(job)}>
                    Gia hạn ngay
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- MODAL GIA HẠN --- */}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeRenewalModal}>
            <div className="renewal-modal" onClick={e => e.stopPropagation()}>
                <button className="btn-close" onClick={closeRenewalModal}><HiX /></button>
                
                <h4>Gia hạn bài đăng</h4>
                <p className="job-name-modal">{selectedJob.title}</p>

                <div className="renewal-form">
                    <label>Số ngày gia hạn:</label>
                    
                    {/* Input số + Đơn vị */}
                    <div className="input-row">
                        <input 
                            type="number" 
                            min="1" 
                            max="30"
                            value={days} 
                            onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <span className="unit-text">ngày</span>
                    </div>
                    
                    {/* Thanh trượt (Slider) */}
                    <input 
                        type="range" 
                        min="1" max="30" 
                        value={days} 
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="range-slider"
                    />
                    
                    <div className="cost-summary">
                        <span>Chi phí dự tính:</span>
                        <strong className="cost-value">{totalCost} điểm</strong>
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