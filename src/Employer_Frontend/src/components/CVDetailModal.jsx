// src/components/CVDetailModal.jsx
import React, { useState } from 'react'; // Thêm useState
import './CVDetailModal.css';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

// Component này nhận props từ employerManage.jsx
export default function CVDetailModal({ cv, onClose, onAccept, onReject, onMarkEmailSent }) {
  if (!cv) return null; 

  // --- STATE NỘI BỘ CỦA MODAL ---
  // 1. Theo dõi trạng thái (đã bấm Đậu CV chưa)
  const [isAccepted, setIsAccepted] = useState(cv.status === 'dau_cv');
  // 2. State cho loading (giả)
  const [isSending, setIsSending] = useState(false);
  // ---------------------------------

  // Ngăn việc bấm vào nội dung modal làm đóng modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Xử lý khi bấm nút "Đậu CV"
  const handleAcceptClick = () => {
    // Chỉ hỏi xác nhận nếu CV chưa được duyệt
    if (!isAccepted && window.confirm("Bạn có chắc muốn DUYỆT CV này?")) {
        onAccept(cv.id); // Gọi hàm cha để cập nhật state chung
        setIsAccepted(true); // Cập nhật state nội bộ để hiển thị UI mail
    }
  };

  // Xử lý khi bấm "Từ chối"
  const handleRejectClick = () => {
      // Hàm cha onReject sẽ tự xử lý confirm và đóng modal
      onReject(cv.id); 
  };

  // Xử lý "Gửi mail" (giả)
  const handleSendMail = () => {
      setIsSending(true);
      setTimeout(() => {
          toast.success(`Đã gửi mail thông báo tới ${cv.email}!`);
          onMarkEmailSent(cv.id); // <--- THÊM: Đánh dấu đã gửi
          setIsSending(false);
          onClose(); // Gửi xong thì đóng modal
      }, 1000); // Giả lập 1s gửi
  };

  return (
    // Nền mờ (overlay), bấm vào sẽ đóng
    <div className="modal-overlay" onClick={onClose}>
      
      {/* Nội dung Modal */}
      <div className="modal-content" onClick={handleContentClick}>
        
        {/* Header */}
        <div className="modal-header">
          <h2>Hồ sơ ứng viên: {cv.name}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <HiX size={24} />
          </button>
        </div>

        {/* Body (Nội dung CV giả lập) */}
        <div className="modal-body">
          <p><strong>Vị trí:</strong> {cv.position}</p>
          <p><strong>Email:</strong> {cv.email}</p>
          <p><strong>Địa điểm:</strong> {cv.location}</p>
          <p><strong>Ngày nộp:</strong> {cv.date}</p>
          
          <div className="fake-cv-content">
            <p>(Đây là khu vực nội dung CV...)</p>
            <p>...</p>
            <p>...(Sau này chúng ta sẽ thay thế bằng file PDF hoặc nội dung CV thật)</p>
          </div>
        </div>

        {/* Footer (Chứa các nút hành động) */}
        <div className="modal-footer">

        {/* --- LOGIC FOOTER MỚI (RÕ RÀNG HƠN) --- */}
        
        {/* 1. Nếu status là 'chua_xem' hoặc 'da_xem' -> Hiển thị 2 nút */}
        {(cv.status === 'chua_xem' || cv.status === 'da_xem') && !isAccepted && (
            <>
            <button className="btn-reject" onClick={handleRejectClick}>
                Từ chối
            </button>
            <button className="btn-accept" onClick={handleAcceptClick}>
                Đậu CV
            </button>
            </>
        )}

        {/* 2. Nếu Đậu CV (isAccepted) VÀ CHƯA GỬI MAIL (!cv.emailSent) -> Hiển thị mail */}
        {isAccepted && !cv.emailSent && (
            <div className="mail-options">
            <p>Bạn muốn thông báo qua mail cho ứng viên?</p>
            <span>{cv.email}</span>
            <div className="mail-buttons">
                <button className="btn-skip" onClick={onClose}>Bỏ qua</button>
                <button className="btn-send-mail" onClick={handleSendMail} disabled={isSending}>
                {isSending ? "Đang gửi..." : "Gửi thông báo"}
                </button>
            </div>
            </div>
        )}

        {/* 3. Nếu Đậu CV VÀ ĐÃ GỬI MAIL (cv.emailSent) -> Hiển thị thông báo */}
        {isAccepted && cv.emailSent && (
            <p style={{ color: '#16a34a', fontWeight: 600, margin: '0 10px' }}>
            Đã gửi thông báo đậu CV cho ứng viên này.
            </p>
        )}

        {/* 4. Nếu status là 'tu_choi' (và chưa bấm đậu) -> Hiển thị text (vô hiệu hóa) */}
        {cv.status === 'tu_choi' && !isAccepted && (
            <p style={{ color: '#dc2626', fontWeight: 600, margin: '0 10px' }}>
            Ứng viên này đã bị từ chối.
            </p>
        )}

        </div>
      </div>
    </div>
  );
}