import React, { useState } from "react";
import "./employerLogin.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function EmployerRegister({ onRegister }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // SEND OTP
  const sendOtp = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok) throw new Error(data.message);

      setOtpSent(true);
      setSuccess("OTP sent! Check your email.");
    } catch (err) {
      setError(err.message || "Could not send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter your OTP.");
      return;
    }

    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const raw = await res.text();
      const data = JSON.parse(raw);

      if (!res.ok) throw new Error(data.message);

      setOtpVerified(true);
      setSuccess("OTP verified! You can now register.");
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // FINAL REGISTER
  const handleRegister = async () => {
    if (!otpVerified) {
      setError("Please verify your OTP first.");
      return;
    }

    if (!email || !password || !company || !phone || !address) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/employerRegister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          company,
          phone,
          address,
        }),
      });

      const raw = await response.text();
      const data = JSON.parse(raw);

      if (!response.ok) throw new Error(data.message);

      setSuccess("Account created! Redirecting...");
      setTimeout(() => onRegister(), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Employer Register</h1>

        {/* Email + OTP Section */}
        <input
          type="text"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
        />

        {!otpVerified && (
          <>
            <button
              className="login-button"
              onClick={sendOtp}
              disabled={otpLoading || otpSent}
            >
              {otpLoading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
            </button>

            {otpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="login-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  className="login-button"
                  onClick={verifyOtp}
                  disabled={otpLoading}
                >
                  {otpLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </>
            )}
          </>
        )}

        {/* ONLY show real form after OTP verified */}
        {otpVerified && (
          <>
            <input
              type="text"
              placeholder="Company Name"
              className="login-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone"
              className="login-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              className="login-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="login-button"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </>
        )}

        {error && <p className="login-error">{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

        <div className="login-footer">
          Already have an account?
          <span
            style={{ cursor: "pointer", color: "#2563eb", marginLeft: 4 }}
            onClick={onRegister}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
}
