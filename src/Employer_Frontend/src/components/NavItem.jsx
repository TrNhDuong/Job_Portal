import React, { useState } from "react";

// --- THAY ĐỔI 1: Thêm 'isActive' vào danh sách props ---
export default function NavItem({ icon, label, children, collapsed, onClick, isActive }) {
  const [open, setOpen] = useState(false);

  // --- THAY ĐỔI 2: Tạo một biến className động ---
  // Nếu 'isActive' là true, nó sẽ thêm class "active"
  const itemClass = `nav-item ${isActive ? "active" : ""}`;

  return (
    <div>
      <div
        // --- THAY ĐỔI 3: Sử dụng biến 'itemClass' thay vì "nav-item" ---
        className={itemClass}
        onClick={() => {
          if (children) setOpen((prev) => !prev);
          if (onClick) onClick();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          cursor: "pointer",
        }}
      >
        <span>{icon} {!collapsed && label}</span>
        {!collapsed && children && <span>{open ? "▲" : "▼"}</span>}
      </div>
      {!collapsed && open && children && <div style={{ marginLeft: 20 }}>{children}</div>}
    </div>
  );
}