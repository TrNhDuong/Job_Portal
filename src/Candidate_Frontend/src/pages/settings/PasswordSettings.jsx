import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Lock, ShieldCheck } from "lucide-react";

// --- COMPONENT INPUT RIÊNG CHO PASSWORD ---
const PasswordInput = ({ label, id, value, onChange, placeholder, helperText }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="password-field-group">
      <label htmlFor={id} className="password-label">
        {label}
      </label>
      <div className="password-input-wrap">
        {/* Icon Lock */}
        <Lock className="password-input-icon" size={14} />
        
        <input
          id={id}
          type={show ? "text" : "password"}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="password-input-field" // Sử dụng class mới từ PasswordSettings.css
        />
        
        {/* Nút Toggle */}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="password-toggle-btn"
          tabIndex="-1"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {helperText && <p className="field-helper-text">{helperText}</p>}
    </div>
  );
};

export default function PasswordSettings() {
  const { user } = useAuth();
  
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); 

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (msg) setMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setMsg({ type: "error", text: "Vui lòng điền đầy đủ các trường." });
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(passwords.newPass)) {
      setMsg({ type: "error", text: "Mật khẩu mới không đủ mạnh." });
      return;
    }

    setLoading(true);
    try {
      await client.post("/api/password/candidate", {
        email: user.email,
        password: passwords.current,
        newpassword: passwords.newPass,
      });

      setMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.message || "Mật khẩu hiện tại không đúng." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-settings-wrapper">
      
      {/* CỘT TRÁI: FORM ĐỔI MẬT KHẨU */}
      <div className="profile-main-column">
        <div className="modern-card">
          
          <div className="modern-card-header">
            <div>
              <h2 className="card-title">Đổi mật khẩu</h2>
              <p className="card-subtitle">Bảo vệ tài khoản bằng mật khẩu mạnh</p>
            </div>
          </div>

          <div className="modern-card-body">
            {msg && (
              <div className={`alert-box password-alert ${msg.type}`}>
                {msg.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                <span>{msg.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="password-form-compact fade-in">
              
              <PasswordInput
                label="Mật khẩu hiện tại"
                id="current"
                value={passwords.current}
                onChange={handleChange}
                placeholder="Nhập mật khẩu đang dùng"
              />

              <div className="password-divider" />

              <PasswordInput
                label="Mật khẩu mới"
                id="newPass"
                value={passwords.newPass}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
              />

              <PasswordInput
                label="Xác nhận mật khẩu mới"
                id="confirm"
                value={passwords.confirm}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
              />

              {/* Box yêu cầu */}
              <div className="password-requirements">
                <p className="password-req-title">Yêu cầu mật khẩu:</p>
                <ul className="password-req-list">
                  <li>Tối thiểu 8 ký tự</li>
                  <li>Chữ hoa (A-Z) & thường (a-z)</li>
                  <li>Số (0-9) & ký tự đặc biệt (@, #, $...)</li>
                </ul>
              </div>

              <div className="password-actions">
                <button 
                  type="submit" 
                  className="password-submit-btn" 
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: SIDEBAR TIPS */}
      <aside className="profile-side-column">
        {/* Vẫn dùng guideline-card từ dashboard.css vì nó dùng chung cho cả trang Profile */}
        <div className="guideline-card">
          <div className="guideline-header">
            <div className="icon-circle bg-green-100 text-green-600">
               <ShieldCheck size={18} />
            </div>
            <h3>An toàn bảo mật</h3>
          </div>
          <div className="guideline-body">
            <ul className="guideline-list">
              <li>
                <strong>Không dùng chung:</strong> Không sử dụng mật khẩu này cho các tài khoản khác.
              </li>
              <li>
                <strong>Thay đổi định kỳ:</strong> Nên đổi mật khẩu 3-6 tháng/lần.
              </li>
              <li>
                <strong>Đăng xuất:</strong> Nhớ đăng xuất khi dùng máy tính công cộng.
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}