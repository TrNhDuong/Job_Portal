// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await client.post("/api/loginCandidate", {
        email: identifier,
        password,
      });

      let userData = null;
      try {
        const profileRes = await client.get(
          `/api/candidate?email=${identifier}`
        );
        userData = profileRes.data.data || profileRes.data;
      } catch (e) {
        userData = {
          name: identifier.split("@")[0],
          email: identifier,
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
        err?.response?.data?.message || err.message || "Đăng nhập thất bại";
      setMsg({ type: "error", text });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-badge">
          <span className="login-badge-dot" />
          <span>JOB PORTAL • ĐĂNG NHẬP ỨNG VIÊN</span>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">
              Chào mừng trở lại{" "}
              <span className="login-title-gradient">CDH Job Portal</span>
            </h1>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <div className="login-input-row">
                <input
                  id="email"
                  type="text"
                  className="login-input-control"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Nhập email đăng nhập"
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
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="login-input-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <EyeOff className="login-eye-icon" />
                  ) : (
                    <Eye className="login-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Thông báo */}
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

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="login-footer">
            Bạn chưa có tài khoản?{" "}
            <button
              type="button"
              className="login-footer-link"
              onClick={() => navigate("/register")}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
