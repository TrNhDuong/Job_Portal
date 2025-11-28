// src/pages/CandidateDashboard.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar.jsx";

export default function CandidateDashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar-wrap">
        <DashboardSidebar />
      </div>

      <div className="dashboard-main-wrap">
        <div className="dashboard-main-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
