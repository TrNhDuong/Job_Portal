import React from "react";

// --- THAY ĐỔI: Gỡ bỏ 'variant' khỏi props ---
export default function TopNavButton({ icon: Icon, label, onClick }) {
  
  return (
    <button
      // --- THAY ĐỔI: Chỉ dùng class "top-nav-bubble" ---
      className="top-nav-bubble"
      onClick={onClick}
    >
      {Icon && <Icon style={{ marginRight: "4px" }} />}
      {label}
    </button>
  );
}