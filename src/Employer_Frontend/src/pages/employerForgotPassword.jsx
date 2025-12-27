import React, { useState, useRef, useEffect } from "react"; // Thêm useRef, useEffect
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiCheck, HiEye, HiEyeOff, HiX } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/forgotPassword.css"; 
import ParticlesAuth from "../components/ParticlesAuth";
import client from "../api/client.js";

export default function EmployerForgotPassword({ onBack }) {
  const navigate = useNavigate();

  // Quản lý các bước: 1 (Email), 2 (OTP), 3 (New Password)
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(null);
  // State form
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  // State riêng cho OTP (Mảng 6 chuỗi)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]); // Ref để điều khiển focus các ô

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Countdown gửi lại mã
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Logic Validate Mật khẩu
  const passCriteria = {
    length: formData.newPassword.length >= 8,
    lower: /[a-z]/.test(formData.newPassword),
    upper: /[A-Z]/.test(formData.newPassword),
    number: /\d/.test(formData.newPassword),
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // --- XỬ LÝ NHẬP OTP (MỚI) ---
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    // Auto lùi lại ô trước
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // --- BƯỚC 1: GỬI OTP ---
  const handleSendOTP = async () => {
    if (!formData.email) return setError("Vui lòng nhập email");   
    setLoading(true);
    setError("");
    try {
        const email = formData.email;
        const response = await client.post(`api/send-otp`, {email});
        if (response.data.success){
          setSuccess("Mã OTP đã được gửi! Kiểm tra email.");
          setCooldown(30);

          setTimeout(() => {
              setStep(2);
              setSuccess("");
              setError("");
          }, 1000);
        }
    } catch (err) {
      setError(err.message || "Không thể gửi OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 2: XÁC THỰC OTP ---
  const handleVerifyOTP = async () => {
    const otpCode = otp.join(""); // Gộp mảng thành chuỗi
    if (otpCode.length !== 6) return setError("Vui lòng nhập đủ 6 số OTP");

    setLoading(true);
    setError("");
    try {

        const email = formData.email;
        const response = await client.post(`/api/verify-otp/forgot/employer`, 
            {email: email, otp: otpCode}
        );
        
        if (response.data.success){
            setToken(response.data.data); 
            setSuccess("Xác thực thành công!");
            setTimeout(() => {
              setStep(3);
              setSuccess("");
              setError("");
            }, 1000);
        }
    } catch (err) {
      setError(err.message || "Mã OTP không chính xác");
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
        const email = formData.email;
        const password = formData.newPassword;
        const response = await client.post(`api/password/reset/employer`, 
            {email: email, password: password},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.data.success){
            setSuccess("Đổi mật khẩu thành công! Đang chuyển hướng...");
            return setTimeout(() => onBack(), 1500);
        }
        setError(response.data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Màu sắc UI
  const atlasGreen = "#0061ff";
  const borderGray = "#d9d9d9";

  return (
    <div className="auth-page">
      <div className="top-left-logo">
        <img src={logoImage} alt="Logo" className="logo-img-small" />
        <span className="brand-name-corner">InspireLeader</span>
      </div>

      <div className="auth-left fade-in">
        <div 
            className="back-link" 
            onClick={onBack} 
        >
            <HiArrowLeft /> Quay lại đăng nhập
        </div>

        <div className="auth-header-compact">
            <h1 className="auth-title" style={step === 2 ? {color: atlasGreen} : {}}>
                {step === 1 && "Quên mật khẩu?"}
                {step === 2 && "Xác thực mã OTP"}
                {step === 3 && "Đặt lại mật khẩu"}
            </h1>
            <p className="auth-subtitle">
                {step === 1 && "Nhập email để nhận mã xác thực"}
                {step === 2 && (<span>Mã xác thực gồm 6 số đã gửi tới <b>{formData.email}</b></span>)}
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
                            onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                        />
                    </div>
                </div>
            )}

            {/* --- FORM BƯỚC 2: OTP (GIAO DIỆN MỚI) --- */}
            {step === 2 && (
                <div className="form-group">
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-start", // Canh trái hoặc center tùy thích
                            marginBottom: 10,
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
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => {
                                    handleOtpBackspace(e, index);
                                    if(e.key === "Enter") handleVerifyOTP();
                                }}
                                style={{
                                    width: "48px",
                                    height: "60px",
                                    fontSize: "26px",
                                    textAlign: "center",
                                    borderRadius: "6px",
                                    border: `1px solid ${borderGray}`,
                                    background: "#fff",
                                    color: "#1f2937",
                                    fontWeight: "600",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = atlasGreen;
                                    e.target.style.boxShadow = `0 0 0 1px ${atlasGreen}`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = borderGray;
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        ))}
                    </div>
                    
                    {/* Link gửi lại mã */}
                    <div style={{ textAlign: "left", marginBottom: 15, fontSize: "0.9rem" }}>
                        Bạn chưa nhận được mã?{" "}
                        {cooldown > 0 ? (
                            <span style={{ opacity: 0.6, color: "#6b7280" }}>
                                Gửi lại sau {cooldown}s
                            </span>
                        ) : (
                            <span
                                onClick={handleSendOTP}
                                style={{
                                    color: atlasGreen,
                                    cursor: "pointer",
                                    fontWeight: 600,
                                }}
                            >
                                Gửi lại mã
                            </span>
                        )}
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
                            />
                            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </div>
                        </div>
                        {/* Validation Box */}
                        <div className="validation-box" onMouseDown={(e) => e.preventDefault()}>
                            <div className="validation-header">Mật khẩu của bạn phải chứa:</div>
                            <ul className="validation-list">
                                <li className={`validation-item ${passCriteria.length ? 'valid' : ''}`}>
                                    {passCriteria.length ? <HiCheck className="check-icon"/> : <span className="dot">•</span>} Từ 8 ký tự trở lên
                                </li>
                                <li className={`validation-item ${passCriteria.lower ? 'valid' : ''}`}>
                                    {passCriteria.lower ? <HiCheck className="check-icon"/> : <span className="dot">•</span>} Ít nhất 1 chữ thường
                                </li>
                                <li className={`validation-item ${passCriteria.upper ? 'valid' : ''}`}>
                                    {passCriteria.upper ? <HiCheck className="check-icon"/> : <span className="dot">•</span>} Ít nhất 1 chữ hoa
                                </li>
                                <li className={`validation-item ${passCriteria.number ? 'valid' : ''}`}>
                                    {passCriteria.number ? <HiCheck className="check-icon"/> : <span className="dot">•</span>} Ít nhất 1 số
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
                                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
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

            {/* Nút bấm thay đổi theo từng bước */}
            <button 
                className="auth-button" 
                onClick={() => {
                    if (step === 1) handleSendOTP();
                    if (step === 2) handleVerifyOTP();
                    if (step === 3) handleResetPassword();
                }} 
                disabled={loading || (step === 2 && otp.join("").length < 6)}
                style={{
                    // Logic màu sắc:
                    // Bước 2: Nếu đủ 6 số -> Màu xanh. Chưa đủ -> Màu xám nhạt
                    backgroundColor: step === 2 
                        ? (otp.join("").length === 6 ? atlasGreen : "#e5e7eb") 
                        : (step === 1 || step === 3 ? atlasGreen : ""),
                    
                    // Logic màu chữ: Bước 2 chưa xong -> Chữ xám đậm cho dễ nhìn trên nền xám nhạt
                    color: (step === 2 && otp.join("").length < 6) ? "#9ca3af" : "white",
                    
                    // Con trỏ chuột
                    cursor: (step === 2 && otp.join("").length < 6) ? "not-allowed" : "pointer",
                    
                    // Hiệu ứng chuyển màu mượt
                    transition: "all 0.2s ease"
                }}
            >
                {loading ? "Đang xử lý..." : 
                    step === 1 ? "Gửi mã xác thực" : 
                    step === 2 ? "Xác nhận OTP" : 
                    "Đổi mật khẩu"
                }
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
