import { useState } from "react";
import client from "../api/client";

const Eye = ({ onClick }) => (
  <svg className="icon-right" onClick={onClick} viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor"/>
  </svg>
);
const UserIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor"/>
    <path d="M4 20c2-4 6-4 8-4s6 0 8 4" stroke="currentColor"/>
  </svg>
);
const MailIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <path d="M4 6h16v12H4z" stroke="currentColor"/><path d="m4 7 8 6 8-6" stroke="currentColor"/>
  </svg>
);
const LockIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor"/>
    <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor"/>
  </svg>
);

export default function RegisterCandidateForm() {
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", agree:false });
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return setMsg({ type: "error", text: "Vui lòng điền đầy đủ thông tin." });
    }
    if (form.password !== form.confirm) {
      return setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
    }
    if (!form.agree) {
      return setMsg({ type: "error", text: "Bạn cần đồng ý Điều khoản và Chính sách." });
    }
    try {
      setLoading(true);
      const res = await client.post("/candidateRegister", {
        email: form.email,
        password: form.password,
        name: form.name
      });
      setMsg({ type: "success", text: res?.data?.message || "Đăng ký thành công" });
      setForm({ name:"", email:"", password:"", confirm:"", agree:false });
    } catch (err) {
      setMsg({ type: "error", text: err?.response?.data?.message || "Đăng ký thất bại" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <div className="input-wrap">
        <UserIcon/>
        <input className="input" name="name" placeholder="Nhập họ tên"
               value={form.name} onChange={onChange}/>
      </div>
      <div className="input-wrap">
        <MailIcon/>
        <input className="input" name="email" type="email" placeholder="Nhập email"
               value={form.email} onChange={onChange}/>
      </div>
      <div className="input-wrap">
        <LockIcon/>
        <input className="input" name="password" placeholder="Nhập mật khẩu"
               type={show1 ? "text" : "password"} value={form.password} onChange={onChange}/>
        <Eye onClick={()=>setShow1(s=>!s)}/>
      </div>
      <div className="input-wrap">
        <LockIcon/>
        <input className="input" name="confirm" placeholder="Nhập lại mật khẩu"
               type={show2 ? "text" : "password"} value={form.confirm} onChange={onChange}/>
        <Eye onClick={()=>setShow2(s=>!s)}/>
      </div>

      <label className="checkbox-row">
        <input type="checkbox" name="agree" checked={form.agree} onChange={onChange}/>
        <span>
          Tôi đã đọc và đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>.
        </span>
      </label>

      <button className="primary-btn" type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Đăng ký"}
      </button>

      {msg && <div className={msg.type === "error" ? "error" : "success"}>{msg.text}</div>}
    </form>
  );
}
