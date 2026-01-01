import React, { useState } from "react";
import { 
  AlertTriangle, 
  X, 
  CheckCircle, 
  ShieldAlert, 
  Frown, 
  MapPinOff, 
  Ban,
  Loader2,
  PenLine 
} from "lucide-react";
import client from "../api/client"; 
import { useAuth } from "../context/AuthContext";
import "../styles/report-job.css";

export default function ReportJobModal({ job, onClose }) {
  const { user } = useAuth();
  
  // State logic
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reportReasons = [
    { id: "Lừa đảo / Đa cấp", label: "Lừa đảo / Đa cấp", icon: <ShieldAlert size={18} /> },
    { id: "Phân biệt đối xử", label: "Phân biệt vùng miền / Giới tính", icon: <Frown size={18} /> },
    { id: "Sai thông tin", label: "Sai địa điểm / Công ty ma", icon: <MapPinOff size={18} /> },
    { id: "Nội dung xấu", label: "Nội dung không phù hợp", icon: <Ban size={18} /> },
    { id: "other", label: "Lý do khác", icon: <PenLine size={18} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Bạn cần đăng nhập.");

    let finalReason = "";
    if (selectedOption === "other") {
        finalReason = otherText.trim();
        if (!finalReason) return alert("Vui lòng nhập lý do cụ thể.");
    } else {
        finalReason = selectedOption;
    }

    if (!finalReason) return alert("Vui lòng chọn lý do.");

    setLoading(true);
    try {
      const payload = {
          reportedBy: user.email, 
          jobPostId: job._id, // Lấy ID từ props       
          reason: finalReason, 
      };

      const res = await client.post('/api/report', payload);
      if (res.data && res.data.success) {
          setIsSuccess(true);
      } else {
          alert(res.data?.message || "Gửi báo cáo thất bại.");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // UI khi click vào vùng đen bên ngoài -> đóng modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div className="report-modal-overlay" onClick={handleOverlayClick}>
      <div className="report-modal-card animate-zoom-in">
        
        {/* Nút đóng góc phải */}
        <button onClick={onClose} className="report-close-btn">
            <X size={20} />
        </button>

        {isSuccess ? (
          <div className="report-success-view">
            <div className="report-success-icon">
              <CheckCircle size={48} />
            </div>
            <h2>Đã gửi báo cáo</h2>
            <p>Cảm ơn bạn đã đóng góp ý kiến cho tin: <br/><strong>{job.title}</strong></p>
            <button onClick={onClose} className="report-btn primary">
              Đóng
            </button>
          </div>
        ) : (
          <div className="report-content">
            <div className="report-header">
              <div className="report-icon-wrapper">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="report-title">Báo cáo tin tuyển dụng</h2>
                <p className="report-subtitle">Bạn đang báo cáo: <strong>{job.title}</strong></p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="report-section">
                <label className="report-label">Vấn đề bạn gặp phải là gì?</label>
                <div className="report-options">
                  {reportReasons.map((item) => (
                    <label 
                      key={item.id} 
                      className={`report-option ${selectedOption === item.id ? "selected" : ""}`}
                    >
                      <input 
                        type="radio" 
                        name="reason" 
                        value={item.id} 
                        checked={selectedOption === item.id}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        hidden
                      />
                      <span className="report-option-icon">{item.icon}</span>
                      <span className="report-option-text">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {selectedOption === "other" && (
                <div className="report-section animate-fade-in">
                  <textarea 
                    className="report-textarea" 
                    placeholder="Mô tả chi tiết vấn đề..."
                    rows={3}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    autoFocus
                  />
                </div>
              )}

              <div className="report-actions">
                <button 
                  type="button" 
                  className="report-btn ghost" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Hủy bỏ
                </button>
                
                <button 
                  type="submit" 
                  className="report-btn danger flex items-center gap-2 justify-center"
                  disabled={!selectedOption || loading || (selectedOption === "other" && !otherText.trim())}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                  {loading ? "Gửi báo cáo" : "Gửi báo cáo"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}