// src/pages/VerifyOtpPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const inputRefs = useRef([]);

  // Lấy action từ query (?action=xxx)
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get("action"); // 'update-profile' | 'update-password' | null

  // 1. Lấy dữ liệu tạm ở sessionStorage
  useEffect(() => {
    let storageKey;

    if (action === "update-profile") {
      storageKey = "updateProfileData";
    } else if (action === "update-password") {
      storageKey = "updatePasswordData";
    } else {
      storageKey = "registrationData";
    }

    const stored = sessionStorage.getItem(storageKey);

    if (!stored) {
      if (action === "update-profile") navigate("/dashboard/settings/profile");
      else if (action === "update-password") navigate("/login");
      else navigate("/register");
      return;
    }

    const parsed = JSON.parse(stored);
    setData(parsed);
    setEmail(parsed.email);
  }, [action, navigate, location.search]);

  // 2. Đếm ngược resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // --- OTP handlers ---

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Cho phép paste cả dãy OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;

    const nextOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      nextOtp[i] = paste[i];
    }
    setOtp(nextOtp);

    const lastIndex = paste.length - 1;
    if (lastIndex >= 0 && lastIndex < 6) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  // 4. Gửi lại OTP
  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setMsg(null);
    setLoading(true);

    try {
      await client.post("/api/send-otp", { email });
      setMsg({ type: "success", text: "Mã xác thực mới đã được gửi!" });
      setCountdown(120);
    } catch (err) {
      setMsg({ type: "error", text: "Lỗi gửi OTP." });
    } finally {
      setLoading(false);
    }
  };

  // 5. Gửi OTP lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const code = otp.join("");
    if (code.length < 6) {
      setMsg({ type: "error", text: "Vui lòng nhập đủ 6 số OTP." });
      return;
    }

    setLoading(true);

    try {
      // Bước 1: verify OTP
      await client.post("/api/verify-otp", { email, otp: code });

      // Bước 2: xử lý theo action (candidate)
      if (action === "update-profile") {
        if (!data) throw new Error("Không tìm thấy dữ liệu cập nhật profile");
        const { oldEmail, email: newEmail, name, phone } = data;

        await client.patch(`/api/candidate?email=${oldEmail}`, {
          name,
          email: newEmail,
          phone,
        });

        if (user) {
          login({ ...user, name, email: newEmail, phone });
        }

        sessionStorage.removeItem("updateProfileData");
        navigate("/dashboard/settings/profile");
      } else if (action === "update-password") {
        if (!data) throw new Error("Không tìm thấy dữ liệu đổi mật khẩu");

        await client.post("/api/password/candidate", {
          email: data.email,
          newpassword: data.newPassword,
        });

        sessionStorage.removeItem("updatePasswordData");
        setMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        // ĐĂNG KÝ TÀI KHOẢN CANDIDATE MỚI
        if (!data) throw new Error("Không tìm thấy dữ liệu đăng ký");

        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
        };

        await client.post("/api/candidateRegister", payload);

        sessionStorage.removeItem("registrationData");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          "Mã OTP không đúng, đã hết hạn hoặc có lỗi khi xử lý.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      {/* background decor */}
      <div className="otp-bg">
        <div className="otp-bg-circle otp-bg-circle-1" />
        <div className="otp-bg-circle otp-bg-circle-2" />
      </div>

      <div className="otp-container">
        <div className="otp-card">
          {/* Icon */}
          <div className="otp-icon-wrap">
            <div className="otp-icon-glow" />
            <div className="otp-icon-main">
              <ShieldCheck className="otp-icon-shield" strokeWidth={1.5} />
            </div>
            <div className="otp-icon-badge">
              <div className="otp-icon-badge-inner">
                <Lock className="otp-icon-lock" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="otp-header">
            <h2>Xác thực bảo mật</h2>
            <p>
              Nhập mã 6 số chúng tôi vừa gửi tới email{" "}
              <span className="otp-email">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="otp-form">
            {/* OTP inputs */}
            <div className="otp-input-row">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`otp-input ${digit ? "otp-input-filled" : ""}`}
                />
              ))}
            </div>

            {/* Message */}
            {msg && (
              <div
                className={`otp-alert ${
                  msg.type === "error" ? "otp-alert-error" : "otp-alert-success"
                }`}
              >
                {msg.type === "error" ? (
                  <AlertCircle className="otp-alert-icon" />
                ) : (
                  <CheckCircle2 className="otp-alert-icon" />
                )}
                <span>{msg.text}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="otp-submit-btn"
            >
              {loading ? (
                <>
                  <div className="otp-submit-spinner" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  Xác nhận ngay
                  <ArrowRight className="otp-submit-icon" />
                </>
              )}
            </button>

            {/* Resend */}
            <div className="otp-resend">
              <p>Không nhận được mã?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className={`otp-resend-btn ${
                  countdown > 0 ? "otp-resend-btn-disabled" : ""
                }`}
              >
                <RotateCcw className="otp-resend-icon" />
                {countdown > 0
                  ? `Gửi lại sau ${Math.floor(countdown / 60)}:${(
                      countdown % 60
                    )
                      .toString()
                      .padStart(2, "0")}`
                  : "Gửi lại mã OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
