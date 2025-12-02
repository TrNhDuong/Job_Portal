import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiCheck, HiEye, HiEyeOff, HiX } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/forgotPassword.css"; // Dùng lại CSS chuẩn của Login/Register
import ParticlesAuth from "../components/ParticlesAuth";

const API_BASE_URL = "http://localhost:8080/api";

export default function EmployerForgotPassword({ onBack }) {

  // Quản lý các bước: 1 (Email), 2 (OTP), 3 (New Password)
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // -------------------- OTP STATE --------------------
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Logic Validate Mật khẩu (Tái sử dụng từ Register)
  const passCriteria = {
    length: formData.newPassword.length >= 8,
    lower: /[a-z]/.test(formData.newPassword),
    upper: /[A-Z]/.test(formData.newPassword),
    number: /\d/.test(formData.newPassword),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Xóa lỗi khi người dùng nhập lại
  };

  // --- BƯỚC 1: GỬI OTP ---
  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Vui lòng nhập email");
      return;
    }
    sendOtp();
  };

  // -------------------- SEND OTP FUNCTION --------------------
  const sendOtp = async () => {
    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok) throw new Error(data.message);

      setOtpSent(true);
      setOtpModal(true);
      setSuccess("OTP đã được gửi! Kiểm tra email của bạn.");

      // Resend countdown
      setResendTimer(30);
      let countdown = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      setError(err.message || "Không thể gửi OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // --- BƯỚC 2: XÁC THỰC OTP ---
  const handleVerifyOTP = async () => {
    verifyOtp();
  };

  // -------------------- VERIFY OTP FUNCTION --------------------
  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("OTP chưa đầy đủ.");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpCode }),
      });

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok) throw new Error(data.message);

      setOtpVerified(true);
      setOtpModal(false);
      setStep(3); // move to reset password step
      setSuccess("Xác thực OTP thành công!");
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------- OTP INPUT HANDLER --------------------
  const handleOtpInput = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // -------------------- CLOSE OTP MODAL --------------------
  const closeOtpModal = () => {
    setOtpModal(false);
    setOtpSent(false);
  };

  // --- BƯỚC 3: ĐỔI MẬT KHẨU ---
  const handleResetPassword = async () => {
    if (!Object.values(passCriteria).every(Boolean)) return setError("Mật khẩu chưa đủ mạnh");
    if (formData.newPassword !== formData.confirmPassword) return setError("Mật khẩu nhập lại không khớp");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/password/employer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: "dummy", newpassword: formData.newPassword }),
      });

      const text = await response.text(); // grab raw response first
      let data;
      try {
        data = JSON.parse(text); // try parsing JSON
      } catch {
        throw new Error(`Server returned unexpected response: ${text}`);
      }

      if (!data.success) throw new Error(data.message || "Đổi mật khẩu thất bại");

      setSuccess("Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...");
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step === 1) handleSendOTP();
      else if (step === 2) handleVerifyOTP();
      else if (step === 3) handleResetPassword();
    }
  };

  return (
    <div className="auth-page">
      <div className="top-left-logo">
        <img src={logoImage} alt="Logo" className="logo-img-small" />
        <span className="brand-name-corner">InspireLeader</span>
      </div>

      <div className="auth-left fade-in">
        <div className="back-link" onClick={onBack}>
          <HiArrowLeft /> Quay lại đăng nhập
        </div>

        <div className="auth-header-compact">
          <h1 className="auth-title">Quên mật khẩu?</h1>
          <p className="auth-subtitle">
            {step === 1 && "Nhập email để nhận mã xác thực"}
            {step === 2 && `Nhập mã OTP đã gửi tới ${formData.email}`}
            {step === 3 && "Thiết lập mật khẩu mới cho tài khoản của bạn"}
          </p>
        </div>

        <div className="auth-form">
          {step === 1 && (
            <div className="form-group">
              <label className="form-label">Email đăng ký</label>
              <div className="input-wrapper">
                <input
                  name="email" type="email" className="auth-input"
                  placeholder="hr@company.com"
                  value={formData.email} onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label className="form-label">Mật khẩu mới</label>
                <div className="input-wrapper">
                  <input
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Nhập mật khẩu mới"
                    value={formData.newPassword} onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </div>
                </div>
                <div className="validation-box" onMouseDown={(e) => e.preventDefault()}>
                  <div className="validation-header">Mật khẩu của bạn phải chứa:</div>
                  <ul className="validation-list">
                    <li className={`validation-item ${passCriteria.length ? 'valid' : ''}`}>
                      {passCriteria.length ? <HiCheck className="check-icon"/> : <span className="dot">•</span>} 
                      Từ 8 ký tự trở lên
                    </li>
                    <li className={`validation-item ${passCriteria.lower ? 'valid' : ''}`}>
                      {passCriteria.lower ? <HiCheck className="check-icon"/> : <span className="dot">•</span>}
                      Ít nhất 1 chữ thường
                    </li>
                    <li className={`validation-item ${passCriteria.upper ? 'valid' : ''}`}>
                      {passCriteria.upper ? <HiCheck className="check-icon"/> : <span className="dot">•</span>}
                      Ít nhất 1 chữ hoa
                    </li>
                    <li className={`validation-item ${passCriteria.number ? 'valid' : ''}`}>
                      {passCriteria.number ? <HiCheck className="check-icon"/> : <span className="dot">•</span>}
                      Ít nhất 1 số
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu</label>
                <div className="input-wrapper">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="auth-input"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                  </div>
                </div>
              </div>
            </>
          )}

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <button className="auth-button" onClick={() => {
            if (step === 1) handleSendOTP();
            if (step === 2) handleVerifyOTP();
            if (step === 3) handleResetPassword();
          }} disabled={loading}>
            {loading ? "Đang xử lý..." : 
                step === 1 ? "Gửi mã xác thực" : 
                step === 2 ? "Xác nhận OTP" : 
                "Đổi mật khẩu"
            }
          </button>
        </div>
      </div>

      {/* ---------------------- OTP MODAL ---------------------- */}
      {otpModal && (
        <div className="otp-overlay">
          <div className="otp-modal">
            <h2 className="otp-title">Nhập mã OTP</h2>
            <p className="otp-sub">Chúng mình đã gửi mã đến email: <b>{formData.email}</b></p>
            
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  className="otp-input"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpInput(e.target.value, index)}
                />
              ))}
            </div>

            <button className="otp-submit" onClick={verifyOtp} disabled={otpLoading}>
              {otpLoading ? "Đang xác thực..." : "Xác nhận OTP"}
            </button>

            {resendTimer > 0 ? (
              <p className="otp-resend-disabled">
                Gửi lại OTP sau {resendTimer}s
              </p>
            ) : (
              <p className="otp-resend" onClick={sendOtp}>
                Gửi lại mã OTP
              </p>
            )}

            <button className="otp-close" onClick={closeOtpModal}>
              <HiX />
            </button>
          </div>
        </div>
      )}

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
