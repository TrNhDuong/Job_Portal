import React, { useState } from "react";
import Sidebar from "../components/dashboard/SideBar.jsx";
import Analytics from "../components/dashboard/Analytics.jsx";
import DataManagement from "../components/dashboard/DataManagement.jsx";
import "../styles/Home.css";
import JobPostManagement from "../components/dashboard/JobPostManagement.jsx";

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("performance");

  const renderContent = () => {
    switch (selectedMenu) {
      case "performance":
        return <Performance />;
      case "payment":
        return <Payment />;
      case "jobpost-management":
        return <JobPostManagement/>;
      case "user-management":
        return <UserManagement/>;
      
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
      <main className="main-content">{renderContent()}</main>
    </div>
  );
};

export default Home;
