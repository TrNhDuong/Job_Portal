import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); 
  const [msg, setMsg] = useState(null);          

  const handleSubmit = async (e) => {            
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await client.post("/api/admin/login", {
        email: identifier,
        password,
      });
      setMsg({ type: "success", text: res?.data?.message || "Đăng nhập thành công" });
      if (res?.data?.data?.token) localStorage.setItem("token", res.data.data.token);
      navigate("/home");
    } catch (err) {
      const text = err?.response?.data?.message || err.message || "Đăng nhập thất bại";
      setMsg({ type: "error", text });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // tạo nền hiệu ứng (256 khối)
  const gridSpans = Array.from({ length: 256 }).map((_, i) => <span key={i}></span>);

  return (
    <section className="background">
      {gridSpans}

      <div className="login-box">
        <h2>Job Portal Admin</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                required
              />
            </div>
          </div>


          {msg && <div className={msg.type === "error" ? "error" : "success"}>{msg.text}</div>} {/* <-- THÊM */}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          
        </form>

      </div>
    </section>
  );
}
