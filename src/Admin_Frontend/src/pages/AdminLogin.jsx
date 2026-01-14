import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiShieldCheck } from "react-icons/hi";
import logoImage from "../assets/logo.png"; 
import "../styles/AdminLogin.css";
import ParticlesAuth from "../components/ParticlesAuth";
import client from "../api/client.js";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // 1. Validate cơ bản
    if (!email || !password) {
      setError("Vui lòng nhập tài khoản và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 2. GỌI API (Y hệt bên Employer)
      // Endpoint này dựa trên file adminRoute.js bạn gửi lúc nãy
      const response = await client.post("/api/admin/login", { 
        email: email, 
        password: password 
      });

      const resData = response.data;

      // 3. XỬ LÝ KẾT QUẢ
      if (resData.success) {
        // --- LOGIC ĐƠN GIẢN GIỐNG EMPLOYER ---
        // Thay vì lưu token phức tạp, ta chỉ cần đánh dấu là đã login
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminName", "Administrator");
        
        // Chuyển hướng ngay lập tức
        setTimeout(() => navigate("/admin/dashboard"), 300);
      } else {
        setError("Đăng nhập thất bại.");
      }

    } catch (err) {
      console.error("Lỗi API:", err);
      // Xử lý lỗi hiển thị
      if (err.response && err.response.status === 401) {
         setError("Tài khoản hoặc mật khẩu không đúng.");
      } else {
         setError("Lỗi kết nối Server.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="auth-page">
      {/* CỘT TRÁI */}
       <div className="top-left-logo">
          <img src={logoImage} alt="Logo" className="logo-img-small" />
          <span className="brand-name-corner">InspireLeader</span>
      </div>

      <div className="auth-left fade-in">
        <div className="auth-header-center">
            <div className="admin-badge">
                <HiShieldCheck /> Administrator Portal
            </div>
            <h1 className="auth-title">Quản Trị Hệ Thống</h1>
            <p className="auth-subtitle">Vui lòng đăng nhập để truy cập Dashboard</p>
        </div>

        <div className="auth-form">
            <div className="form-group">
                <label className="form-label-bold">Tài khoản quản trị</label>
                <div className="input-wrapper">
                    {/* QUAN TRỌNG: Để type="text" để nhập được "tnd" */}
                    <input
                        type="text" 
                        className="auth-input compact-input"
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
                        className="auth-input compact-input"
                        placeholder="••••••••"
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

            <button
                className="auth-button"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Đang xác thực..." : "Truy cập Dashboard"}
            </button>
        </div>
      </div>

      {/* CỘT PHẢI */}
      <div className="auth-right">
        <ParticlesAuth />
        <div className="hero-text-container">
            <h1>GIÁM SÁT</h1>
            <div className="spacer"></div>
            <h1>ĐIỀU PHỐI</h1>
        </div>
      </div>
    </div>
  );
}