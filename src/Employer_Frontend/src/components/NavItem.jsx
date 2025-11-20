import React from "react";
import "./NavItem.css";

export default function NavItem({ icon, label, isActive, onClick }) {
  return (
    <div
      className={`navitem-pro ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="navitem-icon">{icon}</div>
      <div className="navitem-label">{label}</div>

      {/* thanh highlight chạy animation */}
      {isActive && <div className="active-indicator" />}
    </div>
  );
}
