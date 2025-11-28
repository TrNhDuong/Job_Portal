import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiCheck, HiEye, HiEyeOff } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/forgotPassword.css"; // Dùng lại CSS chuẩn của Login/Register

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
    if (!formData.email) return setError("Vui lòng nhập email");
    
    setLoading(true);
    try {

        // Giả lập UI
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess("Mã OTP giả lập (123456) đã được gửi!");

        // SỬA ĐOẠN NÀY KẾT NỐI API
        //   const response = await fetch(`${API_BASE_URL}/otp/send`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email: formData.email }),
        //   });
        //   const data = await response.json();

        //   if (!data.success) throw new Error(data.message || "Không tìm thấy email.");     
        //    setSuccess("Mã OTP đã được gửi đến email của bạn.");


      setTimeout(() => {
          setStep(2);
          setSuccess("");
          setError("");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 2: XÁC THỰC OTP ---
  const handleVerifyOTP = async () => {
    if (!formData.otp) return setError("Vui lòng nhập mã OTP");

    setLoading(true);
    try {

        // Giả lập UI
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (formData.otp !== "123456") {
            throw new Error("Mã OTP sai rồi (Thử nhập 123456 xem)");
        }

        // SỬA API Ở ĐÂY
        //   const response = await fetch(`${API_BASE_URL}/otp/verify`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        //   });
        //   const data = await response.json();

        //   if (!data.success) throw new Error("Mã OTP không chính xác hoặc đã hết hạn");

      setSuccess("Xác thực thành công!");
      setTimeout(() => {
          setStep(3);
          setSuccess("");
          setError("");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 3: ĐỔI MẬT KHẨU ---
  const handleResetPassword = async () => {
    if (!Object.values(passCriteria).every(Boolean)) return setError("Mật khẩu chưa đủ mạnh");
    if (formData.newPassword !== formData.confirmPassword) return setError("Mật khẩu nhập lại không khớp");

    setLoading(true);
    try {

        // Giả lập UI
        await new Promise(resolve => setTimeout(resolve, 2000));

        // SỬA API Ở ĐÂY
        //   const response = await fetch(`${API_BASE_URL}/password/reset`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ email: formData.email, newPassword: formData.newPassword }),
        //   });
        //   const data = await response.json();

        //   if (!data.success) throw new Error(data.message || "Đổi mật khẩu thất bại");

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
      {/* Logo */}
      <div className="top-left-logo">
          <img src={logoImage} alt="Logo" className="logo-img-small" />
          <span className="brand-name-corner">InspireLeader</span>
      </div>

      <div className="auth-left fade-in">
        {/* Nút Back nhỏ để quay lại Login */}
        <div 
            className="back-link" 
            onClick={onBack} 
        >
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
            
            {/* --- FORM BƯỚC 1: EMAIL --- */}
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

            {/* --- FORM BƯỚC 2: OTP --- */}
            {step === 2 && (
                <div className="form-group">
                    <label className="form-label">Mã OTP (6 số)</label>
                    <div className="input-wrapper">
                        <input
                            name="otp" type="text" className="auth-input"
                            placeholder="123456" maxLength="6"
                            value={formData.otp} onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            style={{letterSpacing: 5, fontWeight: 'bold', textAlign: 'center'}}
                        />
                    </div>
                    <div style={{textAlign: 'right', marginTop: 5, fontSize: '0.85rem'}}>
                        <span style={{color: '#0061ff', cursor: 'pointer'}} onClick={handleSendOTP}>Gửi lại mã?</span>
                    </div>
                </div>
            )}

            {/* --- FORM BƯỚC 3: MẬT KHẨU MỚI --- */}
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
                        {/* Tái sử dụng UI Validation đẹp mắt */}
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

            {/* Thông báo lỗi/thành công */}
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            {/* Nút bấm thay đổi theo từng bước */}
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

      <div className="auth-right"></div>
    </div>
  );
}