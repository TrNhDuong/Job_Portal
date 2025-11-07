import React from "react";

export default function TopNavButton({ icon: Icon, label, onClick }) {
  return (
    <button
      className="top-nav-bubble"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1.5px solid #ccc",
        background: "#999",
        cursor: "pointer",
        transition: "0.2s",
        fontWeight: 500,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#e8e8e8";
        e.currentTarget.style.borderColor = "#70899dff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#999";
        e.currentTarget.style.borderColor = "#ccc";
      }}
    >
      {Icon && <Icon style={{ marginRight: "4px" }} />}
      {label}
    </button>
  );
}
