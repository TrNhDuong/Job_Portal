import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/employerLogin.css";
import EmployerForgotPassword from "./employerForgotPassword.jsx";
import ParticlesAuth from "../components/ParticlesAuth";
import client from "../api/client.js";

export default function EmployerLogin() {
  const navigate = useNavigate();

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (isForgotPassword) {
    return <EmployerForgotPassword onBack={() => setIsForgotPassword(false)} />;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await client.post(`/api/loginEmployer`, {email: email, password: password});

      const data = await response.data;
      const { success } = data;

      if (!success) {
        setError("Đăng nhập thất bại.");
        return;
      }

      setSuccess("Đăng nhập thành công");
      localStorage.setItem("email", email)
      setTimeout(() => navigate("/homepage"), 300);

    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="auth-page">
      {/* Cột trái: Form */}
      <div className="top-left-logo">
          <img src={logoImage} alt="Logo" className="logo-img-small" />
          <span className="brand-name-corner">InspireLeader</span>
      </div>
      <div className="auth-left fade-in">
        <div className="auth-header-center">
            <h1 className="auth-title">Chào mừng trở lại! </h1>
            <p className="auth-subtitle">Đăng nhập để tiếp tục quản lý tuyển dụng</p>
        </div>

        <div className="auth-form">
            <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="company@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleKey}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="form-group">
                <div className="label-row">
                    <label className="form-label-bold">Mật khẩu</label>
                    <span 
                        className="forgot-pass-link" 
                        onClick={() => setIsForgotPassword(true)} 
                    >
                        Quên mật khẩu?
                    </span>
                </div>
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
                    <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <HiEyeOff /> : <HiEye />}
                    </div>
                </div>
            </div>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            <button
                className="auth-button"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
        </div>

        <div className="auth-footer">
            Chưa có tài khoản? 
            <span className="auth-link" onClick={() => navigate("/register")}>
                Đăng ký ngay
            </span>
        </div>
      </div>

      {/* Cột phải: Ảnh Art */}
      {/* Cột Phải: Grid Logo Partners */}
      <div className="auth-right">
        
        {/* Component Hạt Tương Tác */}
        <ParticlesAuth />

        {/* Nội dung đè lên trên (Quote) */}
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
