import React from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function ToggleButton({ collapsed, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: "pointer", padding: "8px", fontSize: "24px" }}>
      {collapsed ? <HiMenu /> : <HiX />}
    </div>
  );
}