import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function ForgotPasswordCandidate() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState(""); 

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // ---- B1: GỬI OTP ----
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await client.post("/api/otp/send", { email, role: "Candidate" });

      setMsg({ type: "success", text: res?.data?.message || "Đã gửi OTP về email" });
      setStep(2);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || err.message || "Gửi OTP thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {

      const res = await client.post("/api/otp/verify", { email, otp, role: "Candidate" });

      const receivedToken = res?.data?.token;
      if (!receivedToken) {
        throw new Error("Không nhận được token từ server sau khi verify OTP");
      }

      setToken(receivedToken);
      setMsg({ type: "success", text: "Xác thực OTP thành công. Hãy đặt mật khẩu mới." });
      setStep(3);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || err.message || "Verify OTP thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---- B3: RESET PASSWORD (đúng logic bạn gửi) ----
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      if (newPassword.length < 6) {
        setMsg({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
        setLoading(false);
        return;
      }
      if (newPassword !== confirm) {
        setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp." });
        setLoading(false);
        return;
      }

      const res = await client.post(
        "/api/password/reset/candidate",
        { email, password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ đúng như controller bạn viết
          },
        }
      );

      setMsg({ type: "success", text: res?.data?.message || "Reset password thành công" });

      // về login
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || err.message || "Reset password thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Quên mật khẩu (Ứng viên)</h1>
          </div>

          {msg && (
            <div
              className={
                msg.type === "error"
                  ? "login-message login-message-error"
                  : "login-message login-message-success"
              }
            >
              {msg.text}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form className="login-form" onSubmit={handleSendOtp}>
              <div className="login-field">
                <label className="login-label">Email</label>
                <input
                  className="login-input-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email đã đăng ký"
                  required
                />
              </div>

              <button className="login-submit-btn" disabled={loading}>
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </button>

              <div className="login-footer">
                <button
                  type="button"
                  className="login-footer-link"
                  onClick={() => navigate("/login")}
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="login-field">
                <label className="login-label">Email</label>
                <input className="login-input-control" value={email} disabled />
              </div>

              <div className="login-field">
                <label className="login-label">OTP</label>
                <input
                  className="login-input-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="Nhập mã OTP"
                  inputMode="numeric"
                  required
                />
              </div>

              <button className="login-submit-btn" disabled={loading}>
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
              </button>

              <div className="login-footer">
                <button
                  type="button"
                  className="login-footer-link"
                  onClick={() => setStep(1)}
                >
                  Gửi lại OTP
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form className="login-form" onSubmit={handleResetPassword}>
              <div className="login-field">
                <label className="login-label">Mật khẩu mới</label>
                <input
                  type="password"
                  className="login-input-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </div>

              <div className="login-field">
                <label className="login-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  className="login-input-control"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
              </div>

              <button className="login-submit-btn" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
