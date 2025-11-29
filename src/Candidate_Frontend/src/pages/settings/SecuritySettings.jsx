import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { AlertCircle, CheckCircle, CheckCircle2 } from "lucide-react";

// Toggle item
const SecurityToggle = ({ label, description, checked, onChange }) => {
  const id = label.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="security-toggle">
      <div className="security-toggle-checkbox">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </div>
      <div className="security-toggle-content">
        <label htmlFor={id} className="security-toggle-label">
          {label}
        </label>
        <p className="security-toggle-desc">{description}</p>
      </div>
    </div>
  );
};

export default function SecuritySettings() {
  const { user } = useAuth();
  const [allowJobOffers, setAllowJobOffers] = useState(true);
  const [allowCVReview, setAllowCVReview] = useState(true);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const showToast = (type, text) => {
    setNotificationType(type);
    setNotificationMessage(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      await client.patch(
        `/api/candidate?email=${encodeURIComponent(user.email)}`,
        {
          allowJobOffers,
          allowCVReview,
        }
      );

      const text = "Lưu cài đặt bảo mật thành công!";
      setMsg({ type: "success", text });
      setIsCompleted(true);
      showToast("success", text);
    } catch (err) {
      const text = err.response?.data?.message || "Lỗi lưu cài đặt.";
      setMsg({ type: "error", text });
      showToast("error", text);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Toast nổi góc phải */}
      {showNotification && (
        <div className="security-toast-wrapper">
          <div
            className={`security-toast ${
              notificationType === "success"
                ? "security-toast-success"
                : "security-toast-error"
            }`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="security-toast-icon" />
            ) : (
              <AlertCircle className="security-toast-icon" />
            )}
            <span className="security-toast-text">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Card chính */}
      <div className="security-card">
        <div className="security-header">
          <div>
            <h2>Thay đổi cài đặt bảo mật</h2>
            <p>
              Kiểm soát cách nhà tuyển dụng và hệ thống hỗ trợ tương tác với
              bạn.
            </p>
          </div>
          {isCompleted && (
            <CheckCircle2 className="security-header-icon" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="security-form">
          <SecurityToggle
            label="Nhận cơ hội việc làm tốt hơn"
            description="Nhận cơ hội việc làm với mức lương cao hơn 20 - 50% lương hiện tại từ các nhà tuyển dụng phù hợp."
            checked={allowJobOffers}
            onChange={() => setAllowJobOffers(!allowJobOffers)}
          />

          <SecurityToggle
            label="Cho phép hỗ trợ sửa và đánh giá CV"
            description="Cho phép hệ thống và chuyên gia cải thiện, tối ưu CV để tăng tỉ lệ được phỏng vấn."
            checked={allowCVReview}
            onChange={() => setAllowCVReview(!allowCVReview)}
          />

          <div className="security-actions">
            <button
              type="submit"
              disabled={loading}
              className="security-save-btn"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>

            {msg && (
              <div
                className={`security-inline-msg ${
                  msg.type === "error"
                    ? "security-inline-msg-error"
                    : "security-inline-msg-success"
                }`}
              >
                <AlertCircle className="security-inline-icon" />
                <span>{msg.text}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
