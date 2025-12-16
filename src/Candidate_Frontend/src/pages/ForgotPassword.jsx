// src/pages/ForgotPasswordCandidate.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordCandidate() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setMsg({ type: "error", text: "Vui lòng nhập email." });
      return;
    }

    setLoading(true);
    try {
      await client.post("/api/send-otp", { email: trimmed });

      // key khớp VerifyOtpPage (action forgot-password)
      sessionStorage.setItem("forgotPasswordData", JSON.stringify({ email: trimmed }));

      setMsg({
        type: "success",
        text: "Đã gửi OTP về email. Vui lòng kiểm tra hộp thư (kể cả Spam).",
      });

      setTimeout(() => navigate("/verify-otp?action=forgot-password"), 500);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Gửi OTP thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Badge */}
        <div className="login-badge">
          <span className="login-badge-dot" />
          Account Recovery
        </div>

        <div className="login-card login-card-premium">
          <div className="login-header">
            <div className="login-title-icon">
              <ShieldCheck className="login-title-icon-svg" />
            </div>

            <h1 className="login-title">
              Quên <span className="login-title-gradient">mật khẩu</span>
            </h1>

            <p className="login-subtitle">
              Nhập email đã đăng ký để nhận mã OTP xác thực và đặt lại mật khẩu.
            </p>
          </div>

          {msg && (
            <div
              className={
                msg.type === "error"
                  ? "login-message login-message-error"
                  : "login-message login-message-success"
              }
            >
              {msg.text}
            </div>
          )}

          <form className="login-form" onSubmit={handleSendOtp}>
            <div className="login-field">
              <label className="login-label">Email</label>

              {/* NOTE: dùng login-input-row để ăn CSS đẹp */}
              <div className="login-input-row">
                <Mail className="login-input-leading" />
                <input
                  ref={emailRef}
                  type="email"
                  className="login-input-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vd: example@gmail.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="login-hint">
                OTP có hiệu lực trong khoảng thời gian ngắn, hãy kiểm tra cả mục Spam.
              </div>
            </div>

            <button
              className="login-submit-btn"
              disabled={loading || !email.trim()}
            >
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </button>

            <div className="login-footer">
              <button
                type="button"
                className="login-footer-link"
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
