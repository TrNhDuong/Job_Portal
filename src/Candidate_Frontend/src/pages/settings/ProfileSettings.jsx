// src/pages/settings/ProfileSettings.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  CheckCircle,
  Mail,
  User as UserIcon,
  ShieldAlert,
  Info,
} from "lucide-react";

// Input khung đẹp, bo vừa phải
const FramedInput = ({ label, id, hint, ...props }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-slate-100"
    >
      <span>{label}</span>
      {props.required && (
        <span className="text-xs font-bold text-rose-500">*</span>
      )}
    </label>

    <input
      id={id}
      {...props}
      className={`block w-full rounded-xl border bg-white/80 dark:bg-slate-900/70 px-4 py-2.5 text-[15px]
        text-slate-900 dark:text-slate-50
        placeholder-slate-400 dark:placeholder-slate-500
        border-slate-200 dark:border-slate-800
        shadow-[0_1px_0_rgba(15,23,42,0.03)]
        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-900
        transition-all duration-200
        ${
          props.disabled
            ? "bg-slate-100/80 dark:bg-slate-900/40 cursor-not-allowed text-slate-500 dark:text-slate-500"
            : ""
        }`}
    />
    {hint && (
      <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    )}
  </div>
);

const FramedTextarea = ({ label, id, hint, ...props }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-2 text-[15px] font-semibold text-slate-800 dark:text-slate-100"
    >
      <span>{label}</span>
    </label>
    <textarea
      id={id}
      {...props}
      rows={4}
      className={`block w-full rounded-xl border bg-white/80 dark:bg-slate-900/70 px-4 py-2.5 text-[15px]
        text-slate-900 dark:text-slate-50
        placeholder-slate-400 dark:placeholder-slate-500
        border-slate-200 dark:border-slate-800
        shadow-[0_1px_0_rgba(15,23,42,0.03)]
        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-900
        transition-all duration-200 resize-none`}
    />
    {hint && (
      <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    )}
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

  const [isCompleted, setIsCompleted] = useState(false);

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
      // 1. Không đổi email → update name + description
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
        "Lỗi: Không thể gửi OTP / cập nhật thông tin";
      setMsg({ type: "error", text });
      showToast("error", text);
      setLoading(false);
    }
  };

  if (!user) return null;

  const hasDescription = !!formData.description?.trim();

  return (
    <>
      {/* Toast */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-sm
              ${
                notificationType === "success"
                  ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50/95 dark:bg-red-950/90 border-red-200 dark:border-red-800"
              }`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            )}
            <span
              className={
                notificationType === "success"
                  ? "text-sm text-emerald-800 dark:text-emerald-200"
                  : "text-sm text-red-800 dark:text-red-200"
              }
            >
              {notificationMessage}
            </span>
          </div>
        </div>
      )}

      {/* CARD chính – ít bo góc hơn */}
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-5 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:p-7">
        {/* Header đơn giản, không avatar */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cài đặt thông tin cá nhân
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Hồ sơ ứng viên · Job Portal
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Chưa xác thực email</span>
            </div>

            {isCompleted && (
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Đã lưu thay đổi gần đây</span>
              </div>
            )}
          </div>
        </div>

        {/* Body: form trái, tóm tắt phải */}
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Form bên trái */}
          <form
            onSubmit={handleSubmit}
            className="max-w-xl space-y-5 rounded-xl bg-white/90 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.06)] dark:bg-slate-950/85 dark:shadow-none"
          >
            <div className="mb-1">
              <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">
                Thông tin cơ bản
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Những thông tin này sẽ hiển thị cho nhà tuyển dụng khi bạn ứng
                tuyển.
              </p>
            </div>

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
              hint="Khi thay đổi email, hệ thống sẽ gửi mã OTP để xác thực địa chỉ mới."
              placeholder="your.email@example.com"
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

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-2.5 text-[15px] font-semibold text-white shadow-md shadow-indigo-400/40 transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang gửi..." : "Lưu thay đổi"}
              </button>

              {msg && (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    msg.type === "error"
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{msg.text}</span>
                </div>
              )}
            </div>
          </form>

          {/* Panel tóm tắt bên phải */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white/95 p-4 text-[15px] text-slate-600 shadow-[0_14px_30px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/85 dark:text-slate-300">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Tóm tắt tài khoản
            </p>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-indigo-100 p-1.5 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                <UserIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Họ tên
                </p>
                <p className="text-[15px] font-medium text-slate-900 dark:text-slate-100">
                  {formData.name || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-sky-100 p-1.5 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Email đăng nhập
                </p>
                <p className="break-all text-[15px] font-medium text-slate-900 dark:text-slate-100">
                  {formData.email}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Đây là email nhận thông báo và dùng để đăng nhập hệ thống.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-amber-100 p-1.5 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Giới thiệu bản thân
                </p>
                <p className="text-[14px] text-slate-700 dark:text-slate-300">
                  {hasDescription
                    ? formData.description
                    : "Bạn chưa viết mô tả. Hãy chia sẻ ngắn gọn về bản thân để gây ấn tượng với nhà tuyển dụng."}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50/80 p-3 text-xs text-indigo-800 shadow-sm dark:bg-indigo-950/70 dark:text-indigo-100">
              <p className="mb-1.5 font-semibold">
                Mẹo nhỏ để hồ sơ của bạn “xịn” hơn ✨
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>Giới thiệu bản thân súc tích, tập trung vào điểm mạnh.</li>
                <li>Cập nhật thông tin ngay khi có thay đổi liên hệ.</li>
                <li>Dùng email thường xuyên để không bỏ lỡ cơ hội.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
