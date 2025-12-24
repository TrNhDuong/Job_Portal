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
  const action = searchParams.get("action"); 
  // action: 'update-profile' | 'update-password' | 'forgot-password' | null(default registration)

  // NOTE FIX: mapping sessionStorage key theo action (Candidate-only)
  const getStorageKey = () => {
    if (action === "update-profile") return "updateProfileData";
    if (action === "update-password") return "updatePasswordData";
    if (action === "forgot-password") return "forgotPasswordData";
    return "registrationData";
  };

  // 1) Lấy dữ liệu tạm từ sessionStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    const stored = sessionStorage.getItem(storageKey);

    if (!stored) {
      // NOTE FIX: fallback route rõ ràng theo action
      if (action === "update-profile") return navigate("/dashboard/settings/profile");
      if (action === "update-password") return navigate("/dashboard/settings/security");
      if (action === "forgot-password") return navigate("/forgot-password/candidate");
      return navigate("/register");
    }

    const parsed = JSON.parse(stored);
    setData(parsed);
    setEmail(parsed.email);
  }, [action, navigate, location.search]);

  // 2) Countdown resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // OTP handlers
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;

    const nextOtp = Array(6).fill("");
    for (let i = 0; i < paste.length; i++) nextOtp[i] = paste[i];
    setOtp(nextOtp);

    const lastIndex = Math.min(paste.length - 1, 5);
    if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
  };

  // 4) Gửi lại OTP
  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setMsg(null);
    setLoading(true);

    try {
      await client.post("/api/send-otp", { email });
      setMsg({ type: "success", text: "Mã xác thực mới đã được gửi!" });
      setCountdown(120);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Lỗi gửi OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 5) Submit OTP
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
      // NOTE FIX 1: cần giữ verifyRes để lấy token cho forgot-password
      let verifyRes;

      // NOTE FIX 2: chọn endpoint verify theo action
      if (action === "forgot-password") {
        verifyRes = await client.post("/api/verify-otp/forgot/candidate", {
          email,
          otp: code,
        });
      } else {
        verifyRes = await client.post("/api/verify-otp", {
          email,
          otp: code,
        });
      }

      // ===== ACTION HANDLING =====
      if (action === "update-profile") {
        if (!data) throw new Error("Không tìm thấy dữ liệu cập nhật profile");
        const { oldEmail, email: newEmail, name, phone } = data;

        await client.patch(`/api/candidate?email=${oldEmail}`, {
          name,
          email: newEmail,
          phone,
        });

        if (user) login({ ...user, name, email: newEmail, phone });

        sessionStorage.removeItem("updateProfileData");
        setMsg({ type: "success", text: "Cập nhật thông tin thành công!" });
        setTimeout(() => navigate("/dashboard/settings/profile"), 900);
        return;
      }

      if (action === "update-password") {
        if (!data) throw new Error("Không tìm thấy dữ liệu đổi mật khẩu");

        // NOTE FIX 3: backend /api/password/candidate cần old password + newpassword
        await client.post("/api/password/candidate", {
          email: data.email,
          password: data.oldPassword,     // ✅ bắt buộc nếu backend giữ logic hiện tại
          newpassword: data.newPassword,  // ✅ đúng field name
        });

        sessionStorage.removeItem("updatePasswordData");
        setMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
        setTimeout(() => navigate("/login"), 1200);
        return;
      }

      if (action === "forgot-password") {
        // NOTE FIX 4: token nằm ở verifyRes.data.data (theo backend bạn gửi)
        const token = verifyRes?.data?.data;
        if (!token) throw new Error("Không nhận được token reset từ verify-otp");

        sessionStorage.setItem(
          "resetPasswordData",
          JSON.stringify({ email, token })
        );

        sessionStorage.removeItem("forgotPasswordData");
        navigate("/reset-password");
        return;
      }

      // default: registration
      if (!data) throw new Error("Không tìm thấy dữ liệu đăng ký");

      await client.post("/api/candidateRegister", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      sessionStorage.removeItem("registrationData");
      setMsg({ type: "success", text: "Đăng ký thành công! Hãy đăng nhập." });
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Mã OTP không đúng, đã hết hạn hoặc có lỗi khi xử lý.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-bg">
        <div className="otp-bg-circle otp-bg-circle-1" />
        <div className="otp-bg-circle otp-bg-circle-2" />
      </div>

      <div className="otp-container">
        <div className="otp-card">
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

          <div className="otp-header">
            <h2>Xác thực bảo mật</h2>
            <p>
              Nhập mã 6 số chúng tôi vừa gửi tới email{" "}
              <span className="otp-email">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="otp-form">
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
                  inputMode="numeric"
                />
              ))}
            </div>

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

            <button type="submit" disabled={loading} className="otp-submit-btn">
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

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="otp-cancel-btn"
              disabled={loading}
            >
              Hủy
            </button>

            <div className="otp-resend">
              <p>Không nhận được mã?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || loading}
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
