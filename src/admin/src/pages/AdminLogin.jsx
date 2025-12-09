import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/AdminLogin.css";
import ParticlesAuth from "../components/ParticlesAuth";

const API_BASE_URL = "http://localhost:8080/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Điền thông tin vô cái đã bạn êy 🙃");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError("Sai email hoặc mật khẩu.");
        return;
      }

      // Lưu token
      localStorage.setItem("adminToken", data.data.token);

      setSuccess("Đăng nhập thành công");

      setTimeout(() => navigate("/homepage"), 300);
    } catch (err) {
      setError("Không kết nối được với server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="auth-page">
      <div className="top-left-logo">
        <img src={logoImage} alt="Logo" className="logo-img-small" />
        <span className="brand-name-corner">InspireLeader</span>
      </div>

      <div className="auth-left fade-in">
        <div className="auth-header-center">
          <h1 className="auth-title">Đăng nhập Admin</h1>
        </div>

        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                className="auth-input"
                placeholder="admin@system.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label-bold">Mật khẩu</label>

            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <div
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </div>
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <button className="auth-button" onClick={handleLogin} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </div>
      </div>

      <div className="auth-right">
        <ParticlesAuth />
        <div className="hero-text-container">
            <h1>KẾT NỐI</h1>
            <div className="spacer"></div>
            <h1>NHÂN TÀI</h1>
            <div className="separator"></div>
            <h1>KIẾN TẠO</h1>
            <div className="spacer"></div>
            <h1>TƯƠNG LAI</h1>
        </div>
      </div>
    </div>
  );
}
