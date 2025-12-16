// src/pages/ResetPasswordPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { Eye, EyeOff, ShieldCheck, LockKeyhole } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("resetPasswordData");
    if (!stored) {
      navigate("/forgot-password/candidate");
      return;
    }
    const parsed = JSON.parse(stored);
    setEmail(parsed.email || "");
    setToken(parsed.token || "");
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (password.length < 6) {
      setMsg({ type: "error", text: "Mật khẩu phải >= 6 ký tự." });
      return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }
    if (!token) {
      setMsg({
        type: "error",
        text: "Token reset không tồn tại. Vui lòng xác thực OTP lại.",
      });
      return;
    }

    setLoading(true);
    try {
      await client.post(
        "/api/password/reset/candidate",
        { email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      sessionStorage.removeItem("resetPasswordData");
      setMsg({ type: "success", text: "Đặt lại mật khẩu thành công!" });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Reset mật khẩu thất bại",
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
          Security Verification
        </div>

        <div className="login-card login-card-premium">
          <div className="login-header">
            <div className="login-title-icon">
              <ShieldCheck className="login-title-icon-svg" />
            </div>

            <h1 className="login-title">
              Đặt lại <span className="login-title-gradient">mật khẩu</span>
            </h1>

            <p className="login-subtitle">
              Tạo mật khẩu mới cho tài khoản <span className="login-email-pill">{email}</span>
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

          <form className="login-form" onSubmit={handleReset}>
            {/* Email (readonly) */}
            <div className="login-field">
              <label className="login-label">Email</label>
              <div className="login-input-row login-input-row-disabled">
                <LockKeyhole className="login-input-leading" />
                <input className="login-input-control" value={email} disabled />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Mật khẩu mới</label>
              <div className="login-input-row">
                <input
                  type={showPass ? "text" : "password"}
                  className="login-input-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  required
                />

                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPass ? (
                    <EyeOff className="login-eye-icon" />
                  ) : (
                    <Eye className="login-eye-icon" />
                  )}
                </button>
              </div>

              <div className="login-hint">
                Gợi ý: kết hợp chữ hoa, chữ thường, số để bảo mật hơn.
              </div>
            </div>

            {/* Confirm */}
            <div className="login-field">
              <label className="login-label">Xác nhận mật khẩu</label>
              <div className="login-input-row">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="login-input-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />

                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirm ? (
                    <EyeOff className="login-eye-icon" />
                  ) : (
                    <Eye className="login-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            <button className="login-submit-btn" disabled={loading}>
              {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </button>

            <div className="login-footer">
              <button
                type="button"
                className="login-footer-link"
                onClick={() => navigate("/login")}
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
