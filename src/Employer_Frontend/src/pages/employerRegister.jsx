import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/employerLogin.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function EmployerRegister({ onRegister }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
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

      const data = await response.json();
      const { success, message } = data;

      if (!success) {
        setError(message || "Registration failed.");
        return;
      }
      setSuccess(message || "Registration successful! Redirecting...");
      navigate("/login");

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

        <input
          type="text"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        { (
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
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}
