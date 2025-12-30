import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Globe } from "lucide-react";
import logo from "../../assets/logo.png"; // Sử dụng logo của dự án bạn

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        {/* PHẦN TRÊN: LOGO, LINKS, SOCIALS */}
        <div className="footer-top">
          <div className="footer-logo">
            <img src={logo} alt="CDH Job Portal" className="footer-logo-img" />
            <span className="footer-logo-text">CDH Job Portal</span>
          </div>

          <nav className="footer-nav">
            <Link to="/">HOME</Link>
            <Link to="/jobs">FIND JOBS</Link>
            <Link to="/about">ABOUT</Link>
            <Link to="/blog">BLOG</Link>
            <Link to="/contact">CONTACT</Link>
          </nav>

          <div className="footer-socials">
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
            <a href="#"><Globe size={20} /></a>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* PHẦN DƯỚI: COPYRIGHT & TERMS */}
        <div className="footer-bottom">
          <p className="copyright">
            © Copyright 2025 CDH Job Portal All Rights Reserved
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}