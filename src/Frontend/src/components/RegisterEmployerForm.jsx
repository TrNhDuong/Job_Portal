// src/components/RegisterEmployerForm.jsx

import { useState } from "react";
import client from "../api/client";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Building = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor"/>
    <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2" stroke="currentColor"/>
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
const PhoneIcon = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <path d="M6 2h6l2 4-3 2a12 12 0 0 0 5 5l2-3 4 2v6a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" stroke="currentColor"/>
  </svg>
);
const MapPin = () => (
  <svg className="icon-left" viewBox="0 0 24 24" fill="none">
    <path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z" stroke="currentColor"/>
    <circle cx="12" cy="10" r="2.5" stroke="currentColor"/>
  </svg>
);

export default function RegisterEmployerForm() {
  const [form, setForm] = useState({
    company:"", email:"", password:"", confirm:"", phone:"", address:"", agree:false });
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e)=>{
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };
  
  const onSubmit = async (e)=>{
    e.preventDefault();
    setMsg(null);
    
    const {company, email, password, confirm, phone, address, agree, otp} = form;

    if(!company || !email || !password || !confirm || !phone || !address)
      return setMsg({type:"error", text:"Vui lòng điền đầy đủ thông tin."});
    if(password !== confirm)
      return setMsg({type:"error", text:"Mật khẩu xác nhận không khớp."});
    if(!agree)
      return setMsg({type:"error", text:"Bạn cần đồng ý Điều khoản và Chính sách."});
  
    setLoading(true);
    
    try {
      setLoading(true);
      // 2. GỌI API GỬI OTP
      await client.post("/api/send-otp", { email: form.email });

      // 3. LƯU TẠM DỮ LIỆU FORM
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: form.email,
        password: form.password,
        company: form.company,
        address: form.address,
        phone: form.phone,
        role: 'employer' 
      }));
      
      navigate("/verify-otp"); 

    } catch (err) {
      setMsg({type:"error", text: err.response?.data?.message || "Đăng ký thất bại"});
      setLoading(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <div className="input-wrap">
        <Building/>
        <input className="input" name="company" placeholder="Nhập tên công ty"
               value={form.company} onChange={onChange}/>
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
        <FontAwesomeIcon
          icon={show1 ? faEyeSlash : faEye}
          className="icon-right"
          onClick={() => setShow1(s => !s)}
        />
      </div>
      <div className="input-wrap">
        <LockIcon/>
        <input className="input" name="confirm" placeholder="Nhập lại mật khẩu"
               type={show2 ? "text" : "password"} value={form.confirm} onChange={onChange}/>
        <FontAwesomeIcon
          icon={show1 ? faEyeSlash : faEye}
          className="icon-right"
          onClick={() => setShow1(s => !s)}
        />
      </div>
      <div className="input-wrap">
        <PhoneIcon/>
        <input className="input" name="phone" placeholder="Số điện thoại"
               value={form.phone} onChange={onChange}/>
      </div>
      <div className="input-wrap">
        <MapPin/>
        <input className="input" name="address" placeholder="Địa chỉ công ty"
               value={form.address} onChange={onChange}/>
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