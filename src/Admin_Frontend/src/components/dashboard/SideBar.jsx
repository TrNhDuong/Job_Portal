import React from 'react';
import { FaChartLine, FaDatabase, FaSignOutAlt } from "react-icons/fa";
import logo from '../../assets/logo.png';
import '../../styles/dashboard/SideBar.css';

const Sidebar = ({ onMenuSelect, selectedMenu }) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="menu-section">
        <ul>
          {/* <li
            onClick={() => onMenuSelect("analytics")}
            className={selectedMenu === "analytics" ? "active" : ""}
          >
            <FaChartLine className="menu-icon" /> Statistics & Analytics
          </li> */}
          <li className="menu-header">Statistics</li>

          <li
            onClick={() => onMenuSelect("performance")}
            className={selectedMenu === "performance" ? "active" : ""}
          >
            <FaChartLine className="menu-icon" /> Performance 
            {/* Statistics for performance include access website, user register
            of 2 types (candidate and employer), job post
             */}
          </li>

          <li
            onClick={() => onMenuSelect("payment")}
            className={selectedMenu === "payment" ? "active" : ""}
            // Statistics for payment include total revenue, total transaction,
          >
            <FaChartLine className="menu-icon" /> Payment
          </li>

          <li className="menu-header">Management</li>

          <li
            onClick={() => onMenuSelect("jobpost-management")}
            className={selectedMenu === "jobpost-management" ? "active" : ""}
          >
            <FaDatabase className="menu-icon" /> JobPost Management
          </li>
          {/* Manage for violation reports */}
          <li
            onClick={() => onMenuSelect("user-management")}
            className={selectedMenu === "user-management" ? "active" : ""}
          >
            <FaDatabase className="menu-icon" /> User Management
          </li>
          {/* Manage for violation account */}
        </ul>
      </nav>

      <div className="logout">
        <FaSignOutAlt className="menu-icon" /> Log out
      </div>
    </aside>
  );
};

export default Sidebar;
