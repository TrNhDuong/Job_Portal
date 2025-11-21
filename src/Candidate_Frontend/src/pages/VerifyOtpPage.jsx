// src/pages/VerifyOtpPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const [data, setData] = useState(null);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const inputRefs = useRef([]);

  // Lấy action từ query (?action=xxx)
  const searchParams = new URLSearchParams(location.search);
  const action = searchParams.get("action"); // 'update-profile' | 'update-password' | null

  // 1. Lấy dữ liệu tạm ở sessionStorage
  useEffect(() => {
    let storageKey;

    if (action === "update-profile") {
      storageKey = "updateProfileData";
    } else if (action === "update-password") {
      storageKey = "updatePasswordData";
    } else {
      storageKey = "registrationData";
    }

    const stored = sessionStorage.getItem(storageKey);

    if (!stored) {
      // Không có dữ liệu → quay lại đúng trang
      if (action === "update-profile") navigate("/dashboard/settings/profile");
      else if (action === "update-password") navigate("/login");
      else navigate("/register");
      return;
    }

    const parsed = JSON.parse(stored);
    setData(parsed);
    setEmail(parsed.email);
  }, [action, navigate, location.search]);

  // 2. Đếm ngược resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // 3. Xử lý change OTP
  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/[^0-9]/.test(value)) return; // chỉ cho nhập số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 4. Gửi lại OTP
  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setMsg(null);
    setLoading(true);

    try {
      await client.post("/api/send-otp", { email });
      setMsg({ type: "success", text: "Mã xác thực mới đã được gửi!" });
      setCountdown(120);
    } catch (err) {
      setMsg({ type: "error", text: "Lỗi gửi OTP." });
    } finally {
      setLoading(false);
    }
  };

  // 5. Gửi OTP lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const code = otp.join("");
    if (code.length < 6) {
      setMsg({ type: "error", text: "Vui lòng nhập đủ 6 số OTP." });
      return;
    }

    setLoading(true);

    try {
      // Bước 1: verify OTP
      await client.post("/api/verify-otp", { email, otp: code });

      // Bước 2: xử lý theo action (tất cả đều là candidate)
      if (action === "update-profile") {
        if (!data) throw new Error("Không tìm thấy dữ liệu cập nhật profile");
        const { oldEmail, email: newEmail, name, phone } = data;

        // Backend: PATCH /api/candidate?email=oldEmail
        await client.patch(`/api/candidate?email=${oldEmail}`, {
          name,
          email: newEmail,
          phone,
        });

        if (user) {
          // Cập nhật AuthContext
          login({ ...user, name, email: newEmail, phone });
        }

        sessionStorage.removeItem("updateProfileData");
        navigate("/dashboard/settings/profile");
      } else if (action === "update-password") {
        if (!data) throw new Error("Không tìm thấy dữ liệu đổi mật khẩu");

        await client.post("/api/password/candidate", {
          email: data.email,
          newpassword: data.newPassword,
        });

        sessionStorage.removeItem("updatePasswordData");
        setMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        // ĐĂNG KÝ TÀI KHOẢN CANDIDATE MỚI
        if (!data) throw new Error("Không tìm thấy dữ liệu đăng ký");

        const payload = {
          name: data.name,
          email: data.email,
          password: data.password,
        };

        await client.post("/api/candidateRegister", payload);

        sessionStorage.removeItem("registrationData");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          "Mã OTP không đúng, đã hết hạn hoặc có lỗi khi xử lý.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 flex items-center justify-center shadow-inner">
                <ShieldCheck
                  className="w-10 h-10 text-indigo-600"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-slate-50">
                <div className="bg-emerald-500 rounded-full p-1">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Xác thực bảo mật
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Nhập mã 6 số chúng tôi vừa gửi tới email <br />
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {email}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP inputs */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-16 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white border-2 rounded-xl shadow-sm transition-all duration-200 outline-none ${
                    digit
                      ? "border-indigo-500 text-indigo-600 bg-indigo-50/30"
                      : "border-slate-200 text-slate-700 hover:border-indigo-300"
                  } focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:-translate-y-1`}
                />
              ))}
            </div>

            {/* Message */}
            {msg && (
              <div
                className={`flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg ${
                  msg.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {msg.type === "error" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {msg.text}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-bold text-lg tracking-wide">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Xác nhận ngay
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Resend */}
            <div className="text-center border-t border-slate-100 pt-6">
              <p className="text-slate-500 text-sm mb-2">Không nhận được mã?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                className={`inline-flex items-center gap-2 text-sm font-semibold ${
                  countdown > 0
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-indigo-600 hover:text-indigo-800 hover:underline"
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                {countdown > 0
                  ? `Gửi lại sau ${Math.floor(countdown / 60)}:${(
                      countdown % 60
                    )
                      .toString()
                      .padStart(2, "0")}`
                  : "Gửi lại mã OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
