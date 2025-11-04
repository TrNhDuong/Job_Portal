// src/pages/CandidateDashboard.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar.jsx';

export default function CandidateDashboard() {
  return (
    // Chúng ta dùng chung layout container (max-w-7xl) giống như HomePage
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 flex flex-col md:flex-row gap-8">
      
      {/* CỘT BÊN TRÁI (Sidebar) */}
      <div className="w-full md:w-1/4">
        <DashboardSidebar />
      </div>
      
      {/* CỘT BÊN PHẢI (Nội dung chính) */}
      <div className="w-full md:w-3/4">
        {/* <Outlet /> là nơi các trang con (MyCV, Settings...) sẽ được render */}
        <Outlet />
      </div>

    </div>
  );
}