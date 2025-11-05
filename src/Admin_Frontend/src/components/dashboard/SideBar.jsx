import React from 'react';
import { FaChartLine, FaDatabase, FaSignOutAlt } from "react-icons/fa";
import logo from '../../../public/logo.png';
import '../../styles/dashboard/SideBar.css';

const Sidebar = ({ onMenuSelect, selectedMenu }) => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <nav className="menu-section">
        <ul>
          <li
            onClick={() => onMenuSelect("analytics")}
            className={selectedMenu === "analytics" ? "active" : ""}
          >
            <FaChartLine className="menu-icon" /> Statistics & Analytics
          </li>

          <li
            onClick={() => onMenuSelect("data")}
            className={selectedMenu === "data" ? "active" : ""}
          >
            <FaDatabase className="menu-icon" /> Data Management
          </li>
        </ul>
      </nav>

      <div className="logout">
        <FaSignOutAlt className="menu-icon" /> Log out
      </div>
    </aside>
  );
};

export default Sidebar;
