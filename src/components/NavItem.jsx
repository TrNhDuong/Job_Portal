import React, { useState } from "react";

export default function NavItem({ icon, label, children, collapsed, onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className="nav-item"
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
