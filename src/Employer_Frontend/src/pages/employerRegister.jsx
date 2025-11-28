import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiCheck, HiX } from "react-icons/hi";
import logoImage from "../assets/logo.png";
import "../styles/register.css";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Logic Validate Password
  const passCriteria = {
    length: formData.password.length >= 8,
    lower: /[a-z]/.test(formData.password),
    upper: /[A-Z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  // Hàm xử lý input chung cho gọn
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // Validate sơ bộ
    if (!Object.values(formData).every(val => val)) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setError("Email không hợp lệ");
        return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
        setError("Số điện thoại không hợp lệ");
        return;
    }

    // Kiểm tra kỹ mật khẩu trước khi submit
    if (!Object.values(passCriteria).every(Boolean)) {
        setError("Mật khẩu chưa thỏa mãn các yêu cầu bảo mật");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu nhập lại không khớp");
        return;
    }

    if (!agreeTerms) {
        setError("Bạn cần đồng ý với điều khoản sử dụng");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

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
        setError("Đăng ký thất bại.");
        return;
      }
      
      setSuccess("Đăng ký thành công!");
      navigate("/login");

    } catch (err) {
      setError("Lỗi kết nối server.");
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
            {/* 1. Email */}
            <div className="form-group">
                <label className="form-label">Email doanh nghiệp</label>
                <div className="input-wrapper">
                    <input
                        name="email" type="email" className="auth-input"
                        placeholder="hr@company.com"
                        value={formData.email} onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            {/* 2. Công ty & SĐT (Giữ cùng hàng để tiết kiệm) */}
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Tên công ty</label>
                    <input
                        name="company" type="text" className="auth-input"
                        placeholder="Tên công ty"
                        value={formData.company} onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        name="phone" type="text" className="auth-input"
                        placeholder="Số điện thoại liên hệ"
                        value={formData.phone} onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>

            {/* 3. Địa chỉ */}
            <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                    name="address" type="text" className="auth-input"
                    placeholder="Địa chỉ chi tiết"
                    value={formData.address} onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* 4. Mật khẩu (Dòng riêng) */}
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
                
                {/* Validation Box nằm ngay dưới ô Mật khẩu */}
                {(isPasswordFocused) && (
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
                )}
            </div>

            {/* 5. Nhập lại mật khẩu (Dòng riêng) */}
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

            {/* 6. Checkbox & Button */}
            <label className="terms-checkbox">
                <input 
                    type="checkbox" 
                    checked={agreeTerms} 
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                    Tôi đồng ý với các <a href="#" className="link-term">Điều khoản và Điều kiện</a> của dịch vụ.
                </span>
            </label>

            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

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

      <div className="auth-right"></div>
    </div>
  );
}