// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";

// Icon giống trong RegisterCandidateForm cũ
const UserIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" />
    <path d="M4 20c2-4 6-4 8-4s6 0 8 4" stroke="currentColor" />
  </svg>
);

const MailIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16v12H4z" stroke="currentColor" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" />
  </svg>
);

const LockIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" />
    <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" />
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

  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setMsg({
        type: "error",
        text: "Vui lòng điền đầy đủ thông tin.",
      });
    }

    if (form.password !== form.confirm) {
      return setMsg({
        type: "error",
        text: "Mật khẩu xác nhận không khớp.",
      });
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

      // Gửi OTP
      await client.post("/api/send-otp", { email: form.email });

      // Lưu thông tin đăng ký candidate vào sessionStorage
      sessionStorage.setItem(
        "registrationData",
        JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        })
      );

      // Chuyển sang trang verify OTP
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

  // tạo nền hiệu ứng nếu bạn dùng CSS cũ, có thể bỏ nếu không cần
  // const gridSpans = Array.from({ length: 256 }).map((_, i) => <span key={i}></span>);

  return (
    <div className="page-wrap">
      {/* LEFT: form */}
      <div className="left-col">
        <div className="form-card">
          <h1 className="title">Chào mừng bạn đến với Job Portal</h1>
          <p className="subtitle">
            Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý
            tưởng
          </p>

          {/* Chỉ còn role Ứng viên */}
          <div className="role-tabs">
            <button className="active">Ứng viên</button>
          </div>

          {/* FORM ĐĂNG KÝ CANDIDATE */}
          <form className="form-stack" onSubmit={onSubmit}>
            <div className="input-wrap">
              <UserIcon />
              <input
                className="input"
                name="name"
                placeholder="Nhập họ tên"
                value={form.name}
                onChange={onChange}
              />
            </div>

            <div className="input-wrap">
              <MailIcon />
              <input
                className="input"
                name="email"
                type="email"
                placeholder="Nhập email"
                value={form.email}
                onChange={onChange}
              />
            </div>

            <div className="input-wrap">
              <LockIcon />
              <input
                className="input password-input"
                name="password"
                placeholder="Nhập mật khẩu"
                type={show1 ? "text" : "password"}
                value={form.password}
                onChange={onChange}
              />
              <span
                className="icon-right cursor-pointer select-none"
                onClick={() => setShow1((s) => !s)}
              >
                {show1 ? "Ẩn" : "Hiện"}
              </span>
            </div>

            <div className="input-wrap">
              <LockIcon />
              <input
                className="input password-input"
                name="confirm"
                placeholder="Nhập lại mật khẩu"
                type={show2 ? "text" : "password"}
                value={form.confirm}
                onChange={onChange}
              />
              <span
                className="icon-right cursor-pointer select-none"
                onClick={() => setShow2((s) => !s)}
              >
                {show2 ? "Ẩn" : "Hiện"}
              </span>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
              />
              <span>
                Tôi đã đọc và đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
                <a href="#">Chính sách bảo mật</a>.
              </span>
            </label>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            {msg && (
              <div
                className={msg.type === "error" ? "error" : "success"}
                style={{ marginTop: "8px" }}
              >
                {msg.text}
              </div>
            )}
          </form>

          <div className="divider">Hoặc đăng nhập bằng</div>

          <p className="helper">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: brand panel */}
      <div className="right-panel">
        <div className="right-inner">
          <div className="brand">
            CDH
            <br />
            Dẫn đầu xu thế CV
          </div>
          <p className="tagline">Bước chân khởi đầu đến thành công</p>
        </div>
      </div>
    </div>
  );
}
