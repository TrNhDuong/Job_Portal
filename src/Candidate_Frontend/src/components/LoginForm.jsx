// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();        // <-- lấy login từ AuthContext

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      // 1. Gửi request đăng nhập candidate
      const res = await client.post("/api/loginCandidate", {
        email: identifier,
        password,
      });

      // 2. (Tuỳ backend) Lấy thông tin candidate để lưu vào AuthContext
      // Nếu backend của bạn có GET /api/candidate?email=... thì dùng:
      let userData = null;
      try {
        const profileRes = await client.get(
          `/api/candidate?email=${encodeURIComponent(identifier)}`
        );
        // tuỳ format backend trả về, chỉnh lại cho đúng
        userData = profileRes.data.data || profileRes.data;
      } catch (e) {
        // fallback: nếu chưa có API profile thì ít nhất lưu email
        userData = {
          name: identifier.split("@")[0],
          email: identifier,
        };
      }

      // 3. Cập nhật AuthContext -> Navbar, DashboardSidebar sẽ đổi theo
      login(userData);

      setMsg({
        type: "success",
        text: res?.data?.message || "Đăng nhập thành công",
      });

      // 4. Điều hướng về trang Home
      navigate("/");
    } catch (err) {
      const text =
        err?.response?.data?.message || err.message || "Đăng nhập thất bại";
      setMsg({ type: "error", text });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const gridSpans = Array.from({ length: 256 }).map((_, i) => (
    <span key={i}></span>
  ));

  return (
    <section className="background">
      {gridSpans}

      <div className="login-box">
        <h2>Job Portal Candidate</h2>

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

          {msg && (
            <div className={msg.type === "error" ? "error" : "success"}>
              {msg.text}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </section>
  );
}
