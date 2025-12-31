import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiCheck, HiX } from "react-icons/hi";
import { ShieldCheck } from "lucide-react"; // Import thêm Icon Khiên
import logoImage from "../assets/logo.png";
import "../styles/register.css";
import "../styles/emailModal.css"; // Đảm bảo import CSS cho Modal
import ParticlesAuth from "../components/ParticlesAuth";
import toast from 'react-hot-toast';


const API_BASE_URL = "http://localhost:8080/api";

export default function EmployerRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        company: "",
        phone: "",
        address: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // OTP Logic
    const [otpModal, setOtpModal] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const [loading, setLoading] = useState(false);
    const email = formData.email;

    const passCriteria = {
        length: formData.password.length >= 8,
        lower: /[a-z]/.test(formData.password),
        upper: /[A-Z]/.test(formData.password),
        number: /\d/.test(formData.password),
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // -------------------- SEND OTP --------------------
    const sendOtp = async () => {
        if (!email) {
            toast.error("Email là bắt buộc.");
            return;
        }

        setOtpLoading(true);
        toast.dismiss();

        try {
            const res = await fetch(`${API_BASE_URL}/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const raw = await res.text();
            const data = JSON.parse(raw);

            if (!res.ok) throw new Error(data.message);

            setOtpSent(true);
            setOtpModal(true);
            toast.success("OTP đã được gửi! Hãy kiểm tra email.");

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
            toast.error("Không thể gửi OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    // -------------------- VERIFY OTP --------------------
    const verifyOtp = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 6) {
            toast.error("OTP chưa đầy đủ.");
            return;
        }

        setOtpLoading(true);
        toast.dismiss();

        try {
            const res = await fetch(`${API_BASE_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const raw = await res.text();
            const data = JSON.parse(raw);

            if (!res.ok) throw new Error(data.message);

            setOtpVerified(true);
            setOtpModal(false);
            toast.success("Xác thực OTP thành công!");

        } catch (err) {
            toast.error(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    // --- XỬ LÝ NHẬP OTP (Nâng cao: Tự động focus & Backspace) ---
    const handleOtpInput = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự động nhảy sang ô tiếp theo khi nhập số
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        // Tự động lùi lại ô trước khi nhấn Backspace ở ô trống
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // -------------------- REGISTER --------------------
    const handleRegister = async () => {
        if (!Object.values(formData).every(val => val)) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Email không hợp lệ");
            return;
        }

        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Số điện thoại không hợp lệ");
            return;
        }

        if (!Object.values(passCriteria).every(Boolean)) {
            toast.error("Mật khẩu chưa thỏa mãn yêu cầu");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu nhập lại không khớp");
            return;
        }

        if (!agreeTerms) {
            toast.error("Bạn cần đồng ý điều khoản");
            return;
        }

        if (!otpVerified) {
            toast.error("Bạn cần xác thực OTP.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                company: formData.company,
                phone: formData.phone,
                address: formData.address
            };

            const response = await fetch(`${API_BASE_URL}/employerRegister`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!data.success) {
                toast.error("Đăng ký thất bại.");
                return;
            }

            toast.success("Đăng ký thành công!");
            navigate("/login");

        } catch (err) {
            toast.error("Không thể kết nối server.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleRegister();
        }
    };

    return (
        <div className="auth-page">
            {/* LEFT SIDE */}
            <div className="auth-left-register fade-in">

                <div className="top-left-logo-register">
                    <img src={logoImage} alt="Logo" className="logo-img-small" />
                    <span className="brand-name-corner">InspireLeader</span>
                </div>

                <div className="auth-header-compact">
                    <h1 className="auth-title">Tạo tài khoản mới</h1>
                    <p className="auth-subtitle">Đăng ký để kết nối với hàng ngàn ứng viên</p>
                </div>

                <div className="auth-form">

                    {/* Email & OTP Button */}
                    <div className="form-group">
                        <label className="form-label">Email doanh nghiệp</label>
                        {/* Wrapper mới để chứa input và nút verify */}
                        <div className="input-group-verify">
                            <input
                                name="email"
                                type="email"
                                className="auth-input has-btn" /* Thêm class has-btn để padding phải */
                                placeholder="hr@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                disabled={otpVerified} // Khóa email nếu đã xác thực
                            />
                            
                            {/* Nút Gửi OTP Mới */}
                            {!otpVerified && (
                                <button
                                    type="button"
                                    className="btn-verify"
                                    onClick={sendOtp}
                                    disabled={otpLoading || resendTimer > 0}
                                >
                                    {otpLoading ? (
                                        <>
                                            <div className="spinner-small"></div>
                                            <span>Đang gửi...</span>
                                        </>
                                    ) : (
                                        resendTimer > 0 ? `Gửi lại (${resendTimer}s)` : (otpSent ? "Gửi lại" : "Gửi OTP")
                                    )}
                                </button>
                            )}
                            
                            {/* Icon Check nếu đã xác thực */}
                            {otpVerified && (
                                <HiCheck className="verified-icon" style={{position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', color:'#10b981', fontSize:'1.2rem'}} />
                            )}
                        </div>
                    </div>

                    {/* Company + Phone */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Tên công ty</label>
                            <input
                                name="company"
                                type="text"
                                className="auth-input"
                                placeholder="Tên công ty"
                                value={formData.company}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                name="phone"
                                type="text"
                                className="auth-input"
                                placeholder="Số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <label className="form-label">Địa chỉ</label>
                        <input
                            name="address"
                            type="text"
                            className="auth-input"
                            placeholder="Địa chỉ chi tiết"
                            value={formData.address}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <div className="input-wrapper">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                            />
                            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </div>
                        </div>

                        {/* Password Criteria */}
                        {(isPasswordFocused) && (
                            <div className="validation-box" onMouseDown={(e) => e.preventDefault()}>
                                <div className="validation-header">Mật khẩu của bạn phải chứa:</div>
                                <ul className="validation-list">
                                    <li className={`validation-item ${passCriteria.length ? 'valid' : ''}`}>
                                        {passCriteria.length ? <HiCheck className="check-icon" /> : <span className="dot">•</span>}
                                        Từ 8 ký tự trở lên
                                    </li>
                                    <li className={`validation-item ${passCriteria.lower ? 'valid' : ''}`}>
                                        {passCriteria.lower ? <HiCheck className="check-icon" /> : <span className="dot">•</span>}
                                        Ít nhất 1 chữ thường
                                    </li>
                                    <li className={`validation-item ${passCriteria.upper ? 'valid' : ''}`}>
                                        {passCriteria.upper ? <HiCheck className="check-icon" /> : <span className="dot">•</span>}
                                        Ít nhất 1 chữ hoa
                                    </li>
                                    <li className={`validation-item ${passCriteria.number ? 'valid' : ''}`}>
                                        {passCriteria.number ? <HiCheck className="check-icon" /> : <span className="dot">•</span>}
                                        Ít nhất 1 số
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
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

                    {/* Terms */}
                    <label className="terms-checkbox">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <span>
                            Tôi đồng ý với các{" "}
                            <span
                                className="link-term"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowTerms(true);
                                }}
                            >
                                Điều khoản và Điều kiện
                            </span>
                            .
                        </span>
                    </label>

                    <button className="auth-button" onClick={handleRegister} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                    </button>
                </div>

                <div className="auth-footer">
                    Đã có tài khoản?
                    <span className="auth-link" onClick={() => navigate("/login")}>
                        Đăng nhập ngay
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE */}
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

            {/* ---------------------- NEW OTP MODAL ---------------------- */}
            {otpModal && (
                <div className="otp-modal-overlay">
                    <div className="otp-modal-card">
                        {/* Nút đóng */}
                        <button className="btn-close-absolute" onClick={() => setOtpModal(false)}>
                            <HiX size={24} />
                        </button>

                        {/* Icon Khiên bảo mật */}
                        <div className="otp-shield-icon">
                            <ShieldCheck size={36} strokeWidth={2} />
                        </div>
                        
                        <h3 className="otp-title">Xác thực tài khoản</h3>
                        <p className="otp-desc">
                            Chúng tôi đã gửi mã xác thực 6 số đến email <strong>{formData.email}</strong>. 
                            <br/>Vui lòng kiểm tra hộp thư (kể cả mục Spam).
                        </p>

                        {/* Ô nhập 6 số */}
                        <div className="otp-inputs">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`} 
                                    type="text"
                                    maxLength="1"
                                    className="otp-slot"
                                    value={digit}
                                    onChange={(e) => handleOtpInput(e.target.value, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    autoFocus={index === 0} // Tự động focus ô đầu
                                />
                            ))}
                        </div>

                        {/* Footer Modal */}
                        <div className="otp-footer">
                            <button 
                                className="btn-confirm-otp" 
                                onClick={verifyOtp} 
                                disabled={otpLoading || otp.join("").length < 6}
                            >
                                {otpLoading ? "Đang xác thực..." : "Xác thực ngay"}
                            </button>
                            
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                Chưa nhận được mã?{' '}
                                <button 
                                    type="button"
                                    onClick={sendOtp}
                                    disabled={resendTimer > 0 || otpLoading}
                                    style={{ 
                                        background: 'none', border: 'none', color: '#2563eb', 
                                        fontWeight: 700, cursor: resendTimer > 0 ? 'default' : 'pointer',
                                        opacity: resendTimer > 0 ? 0.6 : 1, padding: 0
                                    }}
                                >
                                    {resendTimer > 0 ? `Gửi lại sau ${resendTimer}s` : "Gửi lại mã mới"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TERMS MODAL (Giữ nguyên) */}
            {showTerms && (
                <div className="terms-modal-overlay" onClick={() => setShowTerms(false)}>
                    <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="terms-header">
                            <h3>Điều khoản dịch vụ & Chính sách bảo mật</h3>
                            <button className="btn-close-terms" onClick={() => setShowTerms(false)}>
                                <HiX />
                            </button>
                        </div>

                        <div className="terms-body">
                            <p>Chào mừng bạn đến với <strong>InspireLeader</strong>.</p>
                            <h4>1. Trách nhiệm của Nhà tuyển dụng</h4>
                            <ul>
                                <li>Cung cấp thông tin doanh nghiệp chính xác.</li>
                                <li>Không đăng tin tuyển dụng ảo hoặc lừa đảo.</li>
                                <li>Bảo mật thông tin ứng viên.</li>
                            </ul>
                            <h4>2. Quyền lợi</h4>
                            <ul>
                                <li>Được đăng tin tuyển dụng.</li>
                                <li>Tiếp cận hồ sơ ứng viên.</li>
                            </ul>
                            <h4>3. Thanh toán</h4>
                            <ul>
                                <li>Điểm Inspire không hoàn lại.</li>
                            </ul>
                            <h4>4. Vi phạm</h4>
                            <p>Có quyền khóa tài khoản nếu có hành vi vi phạm.</p>
                            <p><em>Cập nhật lần cuối: 28/11/2025</em></p>
                        </div>

                        <div className="terms-footer">
                            <button
                                className="btn-accept"
                                onClick={() => {
                                    setAgreeTerms(true);
                                    setShowTerms(false);
                                }}
                            >
                                Tôi đã hiểu và Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}