import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import client from "../../api/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function PasswordSettings() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const showToast = (type, text) => {
    setNotificationType(type);
    setNotificationMessage(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPass !== passwords.confirm) {
      showToast("error", "Mật khẩu mới không khớp.");
      return;
    }

    const newPassword = passwords.newPass;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    const errorMessage =
      "Mật khẩu mới phải có ít nhất 8 kí tự, một chữ hoa, một chữ thường, một chữ số và một kí hiệu đặc biệt.";

    if (!passwordRegex.test(newPassword)) {
      showToast("error", errorMessage);
      return;
    }

    setLoading(true);
    try {
      await client.post("/api/password/candidate", {
        email: user.email,
        password: passwords.current,
        newpassword: passwords.newPass,
      });

      showToast("success", "Đổi mật khẩu thành công!");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      const text =
        err.response?.data?.message || "Lỗi: Mật khẩu hiện tại sai?";
      showToast("error", text);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Toast */}
      {showNotification && (
        <div className="password-toast-wrapper">
          <div
            className={`password-toast ${
              notificationType === "success"
                ? "password-toast-success"
                : "password-toast-error"
            }`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="password-toast-icon" />
            ) : (
              <AlertCircle className="password-toast-icon" />
            )}
            <span className="password-toast-text">
              {notificationMessage}
            </span>
          </div>
        </div>
      )}

      {/* Card chính */}
      <div className="password-card">
        <div className="password-header">
          <div>
            <h2>Thay đổi mật khẩu</h2>
            <p>Giữ tài khoản của bạn an toàn với mật khẩu mạnh.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          {/* Mật khẩu hiện tại */}
          <div className="password-field-row">
            <label htmlFor="current">Mật khẩu hiện tại</label>
            <div className="password-input-wrapper">
              <input
                id="current"
                type={showCurrent ? "text" : "password"}
                name="current"
                value={passwords.current}
                onChange={handleChange}
                placeholder="••••••••"
                className="password-input"
              />
              <FontAwesomeIcon
                icon={showCurrent ? faEyeSlash : faEye}
                className="password-eye-icon"
                onClick={() => setShowCurrent(!showCurrent)}
              />
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="password-field-row password-field-row--top">
            <label htmlFor="newPass">Mật khẩu mới</label>
            <div className="password-input-group">
              <div className="password-input-wrapper">
                <input
                  id="newPass"
                  type={showNewPass ? "text" : "password"}
                  name="newPass"
                  value={passwords.newPass}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="password-input"
                />
                <FontAwesomeIcon
                  icon={showNewPass ? faEyeSlash : faEye}
                  className="password-eye-icon"
                  onClick={() => setShowNewPass(!showNewPass)}
                />
              </div>
              <p className="password-helper">
                Ít nhất 8 ký tự, bao gồm{" "}
                <span>chữ hoa</span>, <span>chữ thường</span>,{" "}
                <span>chữ số</span> và <span>kí tự đặc biệt</span>.
              </p>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="password-field-row">
            <label htmlFor="confirm">Nhập lại mật khẩu mới</label>
            <div className="password-input-wrapper">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={passwords.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="password-input"
              />
              <FontAwesomeIcon
                icon={showConfirm ? faEyeSlash : faEye}
                className="password-eye-icon"
                onClick={() => setShowConfirm(!showConfirm)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="password-actions">
            <button
              type="submit"
              disabled={loading}
              className="password-submit-btn"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
