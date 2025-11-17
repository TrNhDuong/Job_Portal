import React, { useState } from "react";
import Sidebar from "../components/dashboard/SideBar.jsx";
import Analytics from "../components/dashboard/Analytics.jsx";
import DataManagement from "../components/dashboard/DataManagement.jsx";
import "../styles/Home.css";

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("analytics");

  const renderContent = () => {
    switch (selectedMenu) {
      case "analytics":
        return <Analytics />;
      case "data":
        return <DataManagement />;
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
