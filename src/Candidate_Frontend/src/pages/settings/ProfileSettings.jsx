// src/pages/settings/ProfileSettings.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";

import {
  AlertCircle,
  CheckCircle,
  Mail,
  User as UserIcon,
  Info,
} from "lucide-react";

import "../../styles/dashboard.css";

const FramedInput = ({ label, id, hint, ...props }) => (
  <div className="profile-field">
    <label htmlFor={id} className="profile-field-label">
      <span>{label}</span>
      {props.required && <span className="profile-required">*</span>}
    </label>

    <input
      id={id}
      {...props}
      className={`profile-input ${
        props.disabled ? "profile-input-disabled" : ""
      }`}
    />
    {hint && <p className="profile-field-hint">{hint}</p>}
  </div>
);

const FramedTextarea = ({ label, id, hint, ...props }) => (
  <div className="profile-field">
    <label htmlFor={id} className="profile-field-label">
      <span>{label}</span>
    </label>
    <textarea id={id} rows={4} {...props} className="profile-textarea" />
    {hint && <p className="profile-field-hint">{hint}</p>}
  </div>
);

export default function ProfileSettings() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // toast
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        description: user.description || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMsg(null);
  };

  const showToast = (type, text) => {
    setNotificationType(type);
    setNotificationMessage(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setMsg(null);
    setLoading(true);

    const isEmailChanged = formData.email !== user.email;

    try {
      // chỉ đổi name + description
      if (!isEmailChanged) {
        const payload = {
          name: formData.name,
          description: formData.description,
        };

        await client.patch(
          `/api/candidate?email=${encodeURIComponent(user.email)}`,
          payload
        );
        login({ ...user, ...payload });

        const text = "Cập nhật thông tin thành công!";
        setMsg({ type: "success", text });
        showToast("success", text);
        setLoading(false);
        return;
      }

      // đổi email: gửi OTP
      await client.post("/api/send-otp", { email: formData.email });

      sessionStorage.setItem(
        "updateProfileData",
        JSON.stringify({
          ...formData,
          oldEmail: user.email,
          role: "candidate",
        })
      );

      showToast(
        "success",
        "Đã gửi mã xác thực đến email mới, vui lòng kiểm tra hộp thư."
      );
      setLoading(false);
      navigate("/verify-otp?action=update-profile");
    } catch (err) {
      const text =
        err.response?.data?.message ||
        "Lỗi: Không thể gửi OTP / cập nhật thông tin.";
      setMsg({ type: "error", text });
      showToast("error", text);
      setLoading(false);
    }
  };

  if (!user) return null;

  const hasDescription = !!formData.description?.trim();

  return (
    <>
      {/* TOAST */}
      {showNotification && (
        <div className="profile-toast">
          <div
            className={`profile-toast-inner ${
              notificationType === "success"
                ? "profile-toast-success"
                : "profile-toast-error"
            }`}
          >
            <CheckCircle className="profile-toast-icon" />
            <span className="profile-toast-text">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* MAIN 2 CỘT – GIỐNG HÌNH BẠN GỬI */}
      <div className="profile-main">
        {/* FORM TRÁI */}
        <section className="profile-main-left">
          <form onSubmit={handleSubmit} className="profile-card">
            <div className="profile-card-header">
              <h2>Chỉnh sửa thông tin</h2>
              <p>
                Những thông tin này sẽ hiển thị cho nhà tuyển dụng khi bạn ứng
                tuyển.
              </p>
            </div>

            <div className="profile-card-body">
              <FramedInput
                label="Họ và tên"
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên đầy đủ của bạn"
              />
              <FramedInput
                label="Email đăng nhập"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                hint="Khi thay đổi email, hệ thống sẽ gửi mã OTP để xác thực địa chỉ mới."
              />
              <FramedTextarea
                label="Giới thiệu bản thân"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả ngắn gọn về kinh nghiệm, kỹ năng và định hướng nghề nghiệp của bạn..."
                hint="Giới thiệu súc tích 2–4 câu, tập trung vào điểm mạnh nổi bật."
              />
            </div>

            <div className="profile-card-footer">
              <button
                type="submit"
                disabled={loading}
                className="profile-primary-btn"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>

              {msg && (
                <div
                  className={`profile-msg ${
                    msg.type === "error"
                      ? "profile-msg-error"
                      : "profile-msg-success"
                  }`}
                >
                  <AlertCircle className="profile-msg-icon" />
                  <span>{msg.text}</span>
                </div>
              )}
            </div>
          </form>
        </section>

        {/* TÓM TẮT PHẢI */}
        <aside className="profile-main-right">
          <div className="profile-summary-card">
            <p className="profile-summary-title">Tóm tắt tài khoản</p>

            <div className="profile-summary-row">
              <div className="profile-summary-icon user">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="profile-summary-label">Họ tên</p>
                <p className="profile-summary-value">
                  {formData.name || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="profile-summary-row">
              <div className="profile-summary-icon mail">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="profile-summary-label">Email đăng nhập</p>
                <p className="profile-summary-value break-all">
                  {formData.email}
                </p>
                <p className="profile-summary-hint">
                  Đây là email nhận thông báo và dùng để đăng nhập hệ thống.
                </p>
              </div>
            </div>

            <div className="profile-summary-row">
              <div className="profile-summary-icon info">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="profile-summary-label">Giới thiệu bản thân</p>
                <p className="profile-summary-desc">
                  {hasDescription
                    ? formData.description
                    : "Bạn chưa viết mô tả. Hãy chia sẻ ngắn gọn về bản thân để gây ấn tượng với nhà tuyển dụng."}
                </p>
              </div>
            </div>

            <div className="profile-tip">
              <p className="profile-tip-title">
                Mẹo nhỏ để hồ sơ của bạn “xịn” hơn ✨
              </p>
              <ul className="profile-tip-list">
                <li>Giới thiệu bản thân súc tích, tập trung vào điểm mạnh.</li>
                <li>Cập nhật thông tin ngay khi có thay đổi liên hệ.</li>
                <li>Dùng email thường xuyên để không bỏ lỡ cơ hội.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
