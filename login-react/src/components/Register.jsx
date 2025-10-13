import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Register() {
  return (
    <>
      <Logo />
      <div className="container">
        <div className="login-box">
          <h2>Register</h2>
          <p>This is the registration page (coming soon).</p>
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </>
  );
}
