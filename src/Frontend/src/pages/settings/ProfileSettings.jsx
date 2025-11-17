// src/pages/settings/ProfileSettings.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, CheckCircle } from "lucide-react";

// Input có style mới
const FramedInput = ({ label, id, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className={`block w-full px-4 py-2.5 rounded-lg border transition-all
        bg-white dark:bg-slate-900
        text-slate-900 dark:text-white
        placeholder-slate-400 dark:placeholder-slate-500
        border-slate-300 dark:border-slate-700
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
        ${props.disabled ? "bg-slate-100 dark:bg-slate-900/60 cursor-not-allowed" : ""}
      `}
    />
  </div>
);

export default function ProfileSettings() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // trạng thái "tab đã hoàn thành"
  const [isCompleted, setIsCompleted] = useState(false);

  // Toast local
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success"); // "success" | "error"
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    setMsg(null);
    setLoading(true);

    const isEmailChanged = formData.email !== user.email;

    try {
      // 1. Không đổi email → chỉ update name + phone
      if (!isEmailChanged) {
        const payload = { name: formData.name, phone: formData.phone };
        await client.patch(`/api/candidate?email=${encodeURIComponent(user.email)}`, payload);

        // cập nhật AuthContext
        login({ ...user, ...payload });

        const text = "Cập nhật thông tin thành công!";
        setMsg({ type: "success", text });
        setIsCompleted(true);
        showToast("success", text);
        setLoading(false);
        return;
      }

      // 2. Đổi email → gửi OTP
      await client.post("/api/send-otp", { email: formData.email });

      sessionStorage.setItem(
        "updateProfileData",
        JSON.stringify({
          ...formData,
          oldEmail: user.email,
          role: "candidate",
        }),
      );

      showToast("success", "Đã gửi mã xác thực đến email mới, vui lòng kiểm tra hộp thư.");
      setLoading(false);
      navigate("/verify-otp?action=update-profile");
    } catch (err) {
      const text = err.response?.data?.message || "Lỗi: Không thể gửi OTP / cập nhật thông tin";
      setMsg({ type: "error", text });
      showToast("error", text);
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Toast nhỏ ở góc phải */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
              notificationType === "success"
                ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
            }`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span
              className={
                notificationType === "success"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-700 dark:text-red-300"
              }
            >
              {notificationMessage}
            </span>
          </div>
        </div>
      )}

      {/* CARD chính */}
      <div className="bg-white dark:bg-slate-950 rounded-lg shadow-sm p-6 md:p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt thông tin cá nhân</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">(*) Các thông tin bắt buộc</p>
          </div>
          {isCompleted && (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
          <FramedInput
            label="Họ và tên *"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <FramedInput
            label="Số điện thoại"
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
          <FramedInput
            label="Email (Thay đổi sẽ cần xác thực)"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg font-semibold shadow-sm
                         bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                         text-white transition-colors"
            >
              {loading ? "Đang gửi..." : "Lưu thay đổi"}
            </button>

            {msg && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  msg.type === "error" ? "text-red-600" : "text-emerald-600"
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{msg.text}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
