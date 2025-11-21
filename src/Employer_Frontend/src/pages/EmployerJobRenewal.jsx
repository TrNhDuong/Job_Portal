import React, { useState } from "react";
import PointDisplay from "../components/PointDisplay";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineEye, HiExclamationCircle } from "react-icons/hi";
import "../styles/employerJobRenewal.css";

const EmployerJobRenewal = ({ onNavigateToDeposit }) => {
  const { auth, handleTransaction } = useAuth();
  //const navigate = useNavigate();

  const [expiredJobs, setExpiredJobs] = useState([
    { id: 1, title: "Senior React Developer", expireDate: "20/11/2025", status: "Expired", applicants: 12, views: 340 },
    { id: 2, title: "Backend NodeJS Engineer", expireDate: "19/11/2025", status: "Expired", applicants: 5, views: 120 },
  ]);

  const handleRenew = (jobId) => {
    const COST = 10;
    if (auth.points < COST) {
      alert("Bạn không đủ điểm. Vui lòng nạp thêm!");
      if (onNavigateToDeposit) {
        onNavigateToDeposit(); 
      }
      return;
    }
    if (window.confirm(`Gia hạn bài này tốn ${COST} điểm?`)) {
      handleTransaction(COST, "remove");
      setExpiredJobs(expiredJobs.filter(job => job.id !== jobId));
      alert("Gia hạn thành công!");
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
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" 
                    alt="Empty" 
                    width="100" 
                    style={{opacity: 0.6, marginBottom: 15}}
                />
                <p style={{fontSize: '1.1rem', color: '#555'}}>Tuyệt vời! Không có bài đăng nào bị hết hạn.</p>
             </div>
          ) : (
            expiredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                    <span className="job-cost">Chi phí: 10 điểm</span>
                </div>
                
                <h4 className="job-title">{job.title}</h4>
                
                <div className="job-meta">
                    <div className="meta-item expire-info">
                        <HiOutlineCalendar /> <span>Hết hạn: {job.expireDate}</span>
                    </div>
                    <div className="meta-row">
                         <div className="meta-item" title="Lượt xem">
                            <HiOutlineEye /> <span>{job.views} lượt xem</span>
                        </div>
                        <div className="meta-item" title="Lượt ứng tuyển">
                            <HiOutlineUsers /> <span>{job.applicants} ứng viên</span>
                        </div>
                    </div>
                </div>

                <div className="job-card-action">
                    <button className="btn-renew-action" onClick={() => handleRenew(job.id)}>
                        Gia hạn ngay
                    </button>
                    <div className="expired-label">Đã hết hạn</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerJobRenewal;