import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";

const UserIcon = () => (
  <svg className="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c2-4 6-4 8-4s6 0 8 4" />
  </svg>
);
const MailIcon = () => (
  <svg className="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="m5 7 7 5 7-5" />
  </svg>
);
const LockIcon = () => (
  <svg className="register-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V8a4 4 0 0 1 8 0v2" />
  </svg>
);

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [policy, setPolicy] = useState(null); // <-- XÓA DÒNG NÀY
  const [emailStatus, setEmailStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedForm = sessionStorage.getItem("temp_register_form");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("temp_register_form", JSON.stringify(form));
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "email") setEmailStatus(null);
  };

  const checkEmailExists = async (rawEmail) => {
    const email = (rawEmail || "").trim();
    if (!email) {
      setEmailStatus(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus("invalid");
      return;
    }
    setEmailStatus("checking");
    try {
      await client.get(`/api/candidate?email=${encodeURIComponent(email)}`);
      setEmailStatus("exists");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) setEmailStatus("available");
      else setEmailStatus(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setMsg({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
    }
    if (emailStatus === null) await checkEmailExists(form.email);
    if (emailStatus === "invalid") return setMsg({ type: "error", text: "Email không đúng định dạng." });
    if (emailStatus === "exists") return setMsg({ type: "error", text: "Email này đã được đăng ký." });
    if (form.password !== form.confirm) return setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      return setMsg({ type: "error", text: "Mật khẩu phải có ít nhất 8 kí tự, 1 hoa, 1 thường, 1 số, 1 đặc biệt." });
    }
    if (!form.agree) return setMsg({ type: "error", text: "Bạn cần đồng ý Điều khoản và Chính sách." });

    try {
      setLoading(true);

      await client.post("/api/send-otp", { email: form.email });

      sessionStorage.removeItem("temp_register_form"); 
      sessionStorage.setItem("registrationData", JSON.stringify({ name: form.name, email: form.email, password: form.password }));
      navigate("/verify-otp");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Đăng ký thất bại" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-badge">
          <span className="register-badge-dot" />
          <span>JOB PORTAL • ĐĂNG KÝ ỨNG VIÊN</span>
        </div>

        <div className="register-card register-card-premium">
          <div className="register-back-btn-wrapper">
            <button
              type="button"
              className="register-back-btn"
              onClick={() => navigate("/")}
              disabled={loading}
            >
              <ArrowLeft size={16} /> 
              <span>Quay lại trang chủ</span>
            </button>
          </div>

          <div className="register-header">
            <div className="register-title-icon">
              <ShieldCheck className="register-title-icon-svg" />
            </div>

            <h1 className="register-title">
              Tạo tài khoản <span className="register-title-gradient">CDH Job Portal</span>
            </h1>
            <p className="register-subtitle">
              Đăng ký để tạo hồ sơ ứng viên, lưu việc và theo dõi ứng tuyển.
            </p>
          </div>

          {msg && (
            <div className={msg.type === "error" ? "register-message register-message-error" : "register-message register-message-success"}>
              {msg.text}
            </div>
          )}

          <form className="register-form" onSubmit={onSubmit}>
            {/* ... (Các input Name, Email, Password giữ nguyên) ... */}
            <div className="register-field">
              <label htmlFor="name" className="register-label">Họ và tên</label>
              <div className="register-input-row">
                <UserIcon />
                <input
                  id="name"
                  name="name"
                  className="register-input-control"
                  placeholder="Nhập họ tên đầy đủ của bạn"
                  value={form.name}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="email" className="register-label">Email</label>
              <div className="register-input-row">
                <MailIcon />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="register-input-control"
                  placeholder="Nhập email đăng ký"
                  value={form.email}
                  onChange={onChange}
                  onBlur={() => checkEmailExists(form.email)}
                />
              </div>
              {/* Messages giữ nguyên */}
              {emailStatus === "checking" && <div className="register-message register-message-info">Đang kiểm tra email...</div>}
              {emailStatus === "invalid" && <div className="register-message register-message-error">Email không đúng định dạng.</div>}
              {emailStatus === "exists" && <div className="register-message register-message-error">Email này đã được đăng ký.</div>}
              {emailStatus === "available" && <div className="register-message register-message-success">Email hợp lệ và chưa đăng ký ✔</div>}
            </div>

            <div className="register-field">
              <div className="register-label-row">
                <label htmlFor="password" className="register-label">Mật khẩu</label>
              </div>
              <div className="register-input-row">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type={show1 ? "text" : "password"}
                  className="register-input-control"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={onChange}
                />
                <button type="button" onClick={() => setShow1((s) => !s)} className="register-eye-btn">
                  {show1 ? <EyeOff className="register-eye-icon" /> : <Eye className="register-eye-icon" />}
                </button>
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="confirm" className="register-label">Xác nhận mật khẩu</label>
              <div className="register-input-row">
                <LockIcon />
                <input
                  id="confirm"
                  name="confirm"
                  type={show2 ? "text" : "password"}
                  className="register-input-control"
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirm}
                  onChange={onChange}
                />
                <button type="button" onClick={() => setShow2((s) => !s)} className="register-eye-btn">
                  {show2 ? <EyeOff className="register-eye-icon" /> : <Eye className="register-eye-icon" />}
                </button>
              </div>
            </div>

            {/* --- PHẦN CHECKBOX ĐÃ SỬA ĐỔI --- */}
            <div className="register-checkbox-row">
              <input 
                id="agree" 
                type="checkbox" 
                name="agree" 
                checked={form.agree} 
                onChange={onChange} 
                className="register-checkbox" 
              />
              <label htmlFor="agree" className="register-checkbox-label">
                Tôi đã đọc và đồng ý với{" "}
                <Link to="/policies" className="register-link">
                  Điều khoản dịch vụ
                </Link>
                {" "}và{" "}
                <Link to="/terms" className="register-link">
                  Chính sách bảo mật
                </Link>.
              </label>
            </div>

            <button type="submit" disabled={loading || emailStatus === "exists" || emailStatus === "checking"} className="register-submit-btn">
              {loading ? "Đang xử lý..." : "Đăng ký ứng viên"}
            </button>

            <div className="register-footer">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="register-footer-link">Đăng nhập ngay</Link>
            </div>
          </form>
        </div>
      </div>

      {/* XÓA PHẦN RENDER POLICY MODAL */}
    </div>
  );
}