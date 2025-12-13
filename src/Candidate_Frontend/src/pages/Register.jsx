// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { Eye, EyeOff } from "lucide-react";

import PolicyModal from "../components/PolicyModal";
import { TERMS_CONTENT, PRIVACY_CONTENT } from "../components/Policies";

const UserIcon = () => (
  <svg
    className="register-input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c2-4 6-4 8-4s6 0 8 4" />
  </svg>
);

const MailIcon = () => (
  <svg
    className="register-input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="m5 7 7 5 7-5" />
  </svg>
);

const LockIcon = () => (
  <svg
    className="register-input-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
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

  // msg: thông báo chung (submit)
  const [msg, setMsg] = useState(null);

  const [loading, setLoading] = useState(false);

  // null | "terms" | "privacy"
  const [policy, setPolicy] = useState(null);

  // ✅ trạng thái email (check khi blur)
  // null | "checking" | "exists" | "available" | "invalid"
  const [emailStatus, setEmailStatus] = useState(null);

  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // nếu người dùng đang sửa email thì reset trạng thái email để tránh báo sai
    if (name === "email") {
      setEmailStatus(null);
    }
  };

  const checkEmailExists = async (rawEmail) => {
    const email = (rawEmail || "").trim();

    if (!email) {
      setEmailStatus(null);
      return;
    }

    // check format email cơ bản trước
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus("invalid");
      return;
    }

    setEmailStatus("checking");

    try {
      // ✅ chỉ dùng getCandidate
      // 200 => tồn tại
      await client.get(`/api/candidate?email=${encodeURIComponent(email)}`);
      setEmailStatus("exists");
    } catch (err) {
      const status = err?.response?.status;

      // 404 => chưa tồn tại => ok
      if (status === 404) {
        setEmailStatus("available");
      } else {
        // lỗi khác: network/500... => không kết luận
        setEmailStatus(null);
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setMsg({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
    }

    // nếu email chưa check thì check luôn (để tránh user chưa blur)
    if (emailStatus === null) {
      await checkEmailExists(form.email);
    }

    if (emailStatus === "invalid") {
      return setMsg({ type: "error", text: "Email không đúng định dạng." });
    }

    if (emailStatus === "exists") {
      return setMsg({
        type: "error",
        text: "Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.",
      });
    }

    if (form.password !== form.confirm) {
      return setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      return setMsg({
        type: "error",
        text: "Mật khẩu phải có ít nhất 8 kí tự, một chữ hoa, một chữ thường, một chữ số và một kí hiệu đặc biệt.",
      });
    }

    if (!form.agree) {
      return setMsg({
        type: "error",
        text: "Bạn cần đồng ý Điều khoản và Chính sách.",
      });
    }

    try {
      setLoading(true);

      // ✅ gửi OTP (email đã được check là available)
      await client.post("/api/send-otp", { email: form.email });

      sessionStorage.setItem(
        "registrationData",
        JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      );

      navigate("/verify-otp");
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Đăng ký thất bại",
      });
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

        <div className="register-card">
          <div className="register-back-btn-wrapper">
            <button
              type="button"
              className="register-back-btn"
              onClick={() => navigate("/")}
            >
              ← Quay lại trang chủ
            </button>
          </div>

          <div className="register-header">
            <h1 className="register-title">
              Chào mừng đến với{" "}
              <span className="register-title-gradient">CDH Job Portal</span>
            </h1>
          </div>

          <form className="register-form" onSubmit={onSubmit}>
            {/* Họ tên */}
            <div className="register-field">
              <label htmlFor="name" className="register-label">
                Họ và tên
              </label>
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

            {/* Email */}
            <div className="register-field">
              <label htmlFor="email" className="register-label">
                Email
              </label>
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
                  onBlur={() => checkEmailExists(form.email)} // ✅ check khi nhập xong
                />
              </div>

              {/* ✅ trạng thái check email */}
              {emailStatus === "checking" && (
                <div className="register-message register-message-info">
                  Đang kiểm tra email...
                </div>
              )}
              {emailStatus === "invalid" && (
                <div className="register-message register-message-error">
                  Email không đúng định dạng.
                </div>
              )}
              {emailStatus === "exists" && (
                <div className="register-message register-message-error">
                  Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.
                </div>
              )}
              {emailStatus === "available" && (
                <div className="register-message register-message-success">
                  Email hợp lệ và chưa đăng ký ✔
                </div>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="register-field">
              <div className="register-label-row">
                <label htmlFor="password" className="register-label">
                  Mật khẩu
                </label>
                <span className="register-hint">
                  Tối thiểu 8 kí tự, có chữ hoa, chữ thường, số & kí tự đặc biệt
                </span>
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
                <button
                  type="button"
                  onClick={() => setShow1((s) => !s)}
                  className="register-eye-btn"
                >
                  {show1 ? (
                    <EyeOff className="register-eye-icon" />
                  ) : (
                    <Eye className="register-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="register-field">
              <label htmlFor="confirm" className="register-label">
                Xác nhận mật khẩu
              </label>
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
                <button
                  type="button"
                  onClick={() => setShow2((s) => !s)}
                  className="register-eye-btn"
                >
                  {show2 ? (
                    <EyeOff className="register-eye-icon" />
                  ) : (
                    <Eye className="register-eye-icon" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox điều khoản */}
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
                <button
                  type="button"
                  className="register-link"
                  onClick={() => setPolicy("terms")}
                >
                  Điều khoản dịch vụ
                </button>{" "}
                và{" "}
                <button
                  type="button"
                  className="register-link"
                  onClick={() => setPolicy("privacy")}
                >
                  Chính sách bảo mật
                </button>
                .
              </label>
            </div>

            {/* Thông báo submit */}
            {msg && (
              <div
                className={
                  msg.type === "error"
                    ? "register-message register-message-error"
                    : "register-message register-message-success"
                }
              >
                {msg.text}
              </div>
            )}

            {/* Nút đăng ký */}
            <button
              type="submit"
              disabled={loading || emailStatus === "exists" || emailStatus === "checking"}
              className="register-submit-btn"
            >
              {loading ? "Đang xử lý..." : "Đăng ký ứng viên"}
            </button>
          </form>

          <div className="register-footer">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="register-footer-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Modal điều khoản / chính sách */}
      <PolicyModal
        open={policy !== null}
        title={policy === "terms" ? "Điều khoản dịch vụ" : "Chính sách bảo mật"}
        onClose={() => setPolicy(null)}
      >
        {policy === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT}
      </PolicyModal>
    </div>
  );
}
