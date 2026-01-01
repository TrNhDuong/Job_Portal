import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/forgotPassword.css";
import toast from 'react-hot-toast';
// import client from "../api/client.js";

export default function EmployerOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "example@email.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(30);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Tự động focus ô tiếp theo khi nhập
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    // Tự động lùi lại ô trước khi nhấn Backspace ở ô trống
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const getOtpString = () => otp.join("");

  const handleVerify = async () => {
    const code = getOtpString();

    if (code.length !== 6) return toast.error("Vui lòng nhập đủ 6 số");

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (code !== "123456") throw new Error("Sai mã OTP (nhập 123456 để test)");

      toast.success("Xác thực thành công!");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setCooldown(30);
    toast.success("Mã OTP mới đã được gửi!");
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0].focus();

    // Thực tế:
    // await client.post("/otp/send", { email });
  };

  // Định nghĩa màu xanh Atlas để tái sử dụng
  const atlasGreen = "#006847";
  const borderGray = "#d9d9d9";

  return (
    <div className="auth-page">
      {/* === Logo góc trái === */}
      <div className="top-left-logo">
        <img src={logoImage} alt="Logo" className="logo-img-small" />
        <span className="brand-name-corner">InspireLeader</span>
      </div>

      {/* === Panel trái === */}
      <div className="auth-left fade-in">
        <div className="back-link" onClick={() => navigate(-1)}>
          <HiArrowLeft /> Quay lại
        </div>

        <div className="auth-header-compact">
          {/* Tiêu đề đổi màu xanh cho giống phong cách Atlas */}
          <h1 className="auth-title" style={{ color: atlasGreen }}>
            Xác thực danh tính
          </h1>
          <p className="auth-subtitle" style={{ fontSize: "1rem" }}>
            Một mã xác thực gồm 6 số đã được gửi đến thiết bị của bạn (<b>{email}</b>). Nhập mã để tiếp tục.
          </p>
        </div>

        <div className="auth-form" style={{ marginTop: '1.5rem'}}>

          {/* ============================
              OTP BOXES — UPDATED UI (ATLAS STYLE)
          ============================ */}
          <div
            style={{
              display: "flex",
              gap: "12px", // Khoảng cách giữa các ô
              justifyContent: "flex-start", // Canh trái như trong hình mẫu
              marginBottom: 25,
              marginTop: 10,
            }}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                style={{
                  // Kích thước hình chữ nhật đứng
                  width: "50px",
                  height: "65px",
                  fontSize: "28px",
                  textAlign: "center",
                  // Bo góc nhẹ hơn
                  borderRadius: "6px",
                  // Viền xám mỏng làm mặc định
                  border: `1px solid ${borderGray}`,
                  background: "#fff",
                  color: "#1f2937", // Màu chữ tối
                  fontWeight: "500",
                  outline: "none", // Loại bỏ outline mặc định của trình duyệt
                  transition: "border-color 0.2s ease-in-out",
                }}
                onFocus={(e) => {
                  // Khi focus: Đổi màu viền sang xanh Atlas
                  e.target.style.borderColor = atlasGreen;
                  // Có thể thêm shadow nhẹ nếu muốn giống hệt ảnh
                  // e.target.style.boxShadow = `0 0 0 3px rgba(0, 104, 71, 0.15)`;
                }}
                onBlur={(e) => {
                  // Khi blur: Trả lại viền xám
                  e.target.style.borderColor = borderGray;
                  // e.target.style.boxShadow = "none";
                }}
              />
            ))}
          </div>

          {/* Checkbox "Don't ask again" (Thêm vào cho giống mẫu) */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, color: '#4b5563', fontSize: '0.9rem' }}>
             <input type="checkbox" id="dontAsk" style={{ marginRight: 8, width: 16, height: 16, accentColor: atlasGreen }} />
             <label htmlFor="dontAsk" style={{ cursor: 'pointer' }}>Không hỏi lại trên thiết bị này trong 14 ngày.</label>
          </div>


          {/* Submit Button */}
          <button
            className="auth-button"
            onClick={handleVerify}
            disabled={loading}
            style={{ backgroundColor: atlasGreen }} // Đổi màu nút cho đồng bộ
          >
            {loading ? "Đang xử lý..." : "Tiếp tục"}
          </button>

           {/* Resend Link */}
           <div style={{ textAlign: "left", marginTop: 20 }}>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', margin: '5px 0' }}>
                Bạn chưa nhận được mã?{" "}
                {cooldown > 0 ? (
                  <span style={{ opacity: 0.6 }}>
                    Gửi lại sau {cooldown}s
                  </span>
                ) : (
                  <span
                    onClick={handleResend}
                    style={{
                      color: atlasGreen, // Màu xanh link
                      cursor: "pointer",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                  >
                    Gửi lại mã
                  </span>
                )}
            </p>
          </div>

        </div>
      </div>

      {/* === Panel phải (Giữ nguyên) === */}
      <div className="auth-right">
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