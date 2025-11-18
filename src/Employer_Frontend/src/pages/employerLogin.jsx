import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./employerLogin.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function EmployerLogin({ onLogin, onShowRegister }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/loginEmployer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      const { success, message } = data;

      if (!success) {
        setError(message || "Login failed.");
        return;
      }

      setSuccess(message || "Login successful! Redirecting...");
      localStorage.setItem("email", email)
      // Delay 1.5 giây rồi chuyển sang trang dashboard
      navigate("/homepage");
      // Gọi hàm onLogin từ props để cập nhật trạng thái đăng nhập ở component cha

    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Employer Login</h1>
        <p className="login-subtitle">Enter your credentials to access your account</p>

        <input
          type="text"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="login-footer">
          Don't have an account?
          <span
            style={{ cursor: "pointer", color: "#2563eb", marginLeft: 4 }}
            onClick={onShowRegister}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}
