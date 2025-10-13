import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Đăng nhập: ${identifier} | Ghi nhớ: ${remember}`);
  };

  return (
    <>
      <Logo />
      <div className="container">
        <div className="login-box">
          <h2>Sign In</h2>
          <p>Please enter your email or phone number and password.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="identifier">Email / Phone number</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or phone"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="form-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Remember me
              </label>
              <a href="#" className="forgot">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-login">Log In</button>

            <p className="or">— or sign in with —</p>

            <div className="social-buttons">
              <button type="button" className="btn-social google">
                Google
              </button>
            </div>

            <div className="bottom-links">
              <Link to="/register" className="register">
                Don't have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
