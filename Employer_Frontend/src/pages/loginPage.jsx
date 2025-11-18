import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import './login.css';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);          

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      // 1. Gọi API (endpoint phải khớp /api/login)
      const res = await client.post("/api/loginEmployer", {
        email: identifier,
        password,
      });

      // --- SỬA Ở ĐÂY ---
      // Chỉ lấy 'user' và 'message' (Không cần 'token')
      const { success, message } = res.data;

      

      if (success){
        setMsg({ type: "success", text: "Đăng nhập thành công" });
        localStorage.setItem("email", email);
        navigate("/"); // Chuyển về Homepage
      } else {
        setMsg({ type: "error", text: "Đăng nhập thất bại" });
      }


    } catch (err) {
      const text = err?.response?.data?.message || err.message || "Đăng nhập thất bại";
      setMsg({ type: "error", text });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // tạo nền hiệu ứng (256 khối)
  const gridSpans = Array.from({ length: 256 }).map((_, i) => <span key={i}></span>);

  return (
    <section className="background">
      {gridSpans}
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <p>Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng.</p>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label>Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="login-form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div className="form-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Remember me
            </label>
            <Link to="/forgot" className="forgot">Quên mật khẩu?</Link> {/* <-- THAY */}
          </div>

          {msg && <div className={msg.type === "error" ? "error" : "success"}>{msg.text}</div>} {/* <-- THÊM */}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          <p className="or">— hoặc đăng nhập bằng —</p>
          <div className="social-buttons">
            <button type="button" className="btn-social google">Google</button>
          </div>

          <div className="bottom-links">
            <Link to="/register" className="register">
              Bạn chưa có tài khoản?
            </Link>
          </div>
        </form>

      </div>
    </section>
  );
}