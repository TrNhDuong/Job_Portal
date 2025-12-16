// src/components/LoginForm.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, LockKeyhole, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const email = identifier.trim();

    if (!email) {
      setMsg({ type: "error", text: "Vui lòng nhập email." });
      return;
    }
    if (!password) {
      setMsg({ type: "error", text: "Vui lòng nhập mật khẩu." });
      return;
    }

    setLoading(true);

    try {
      const res = await client.post("/api/loginCandidate", {
        email,
        password,
      });

      let userData = null;
      try {
        const profileRes = await client.get(`/api/candidate?email=${email}`);
        userData = profileRes.data?.data || profileRes.data;
      } catch {
        userData = {
          name: email.split("@")[0],
          email,
        };
      }

      login(userData);

      setMsg({
        type: "success",
        text: res?.data?.message || "Đăng nhập thành công",
      });

      navigate("/");
    } catch (err) {
      const text =
        err?.response?.data?.message || err?.message || "Đăng nhập thất bại";
      setMsg({ type: "error", text });
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
          <span>JOB PORTAL • ĐĂNG NHẬP ỨNG VIÊN</span>
        </div>

        <div className="login-card login-card-premium">
          {/* Header */}
          <div className="login-header">
            <div className="login-title-icon">
              <ShieldCheck className="login-title-icon-svg" />
            </div>

            <h1 className="login-title">
              Chào mừng trở lại{" "}
              <span className="login-title-gradient">CDH Job Portal</span>
            </h1>

            <p className="login-subtitle">
              Đăng nhập để quản lý hồ sơ, theo dõi ứng tuyển và lưu việc làm.
            </p>
          </div>

          {/* Message */}
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

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <div className="login-input-row">
                <Mail className="login-input-leading" />
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  className="login-input-control"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Nhập email đăng nhập"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Mật khẩu
              </label>
              <div className="login-input-row">
                <LockKeyhole className="login-input-leading" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="login-input-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="login-eye-icon" />
                  ) : (
                    <Eye className="login-eye-icon" />
                  )}
                </button>
              </div>

              <div className="login-forgot-row">
                {/* NOTE: route forgot password candidate cho đúng */}
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={() => navigate("/forgot-password")}
                  disabled={loading}
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading || !identifier.trim() || !password}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="login-footer">
            <div className="login-footer-row">
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                className="login-footer-link"
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>

        <div className="login-footnote">
          Đăng nhập an toàn • Thông tin được mã hóa và bảo vệ.
        </div>
      </div>
    </div>
  );
}
