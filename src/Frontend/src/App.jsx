// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./home/Homepage.jsx"; 
import Navbar from "./components/Navbar.jsx";

// BƯỚC 1: IMPORT CÁC TRANG MỚI
import CandidateDashboard from "./pages/CandidateDashboard.jsx"; 
import JobManagement from "./pages/JobManagement.jsx";         
import MyCV from "./pages/MyCV.jsx";                           
import AccountSettings from "./pages/AccountSettings.jsx";     
import NotificationSettings from "./pages/NotificationSettings.jsx";
function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page-container">
        <Routes> 
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-page" element={<Login />} />

          <Route path="/dashboard" element={<CandidateDashboard />}>
            <Route index element={<JobManagement />} />
            <Route path="my-cv" element={<MyCV />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />

          </Route>

        </Routes>
      </div>
    </div>
  );
}

export default App;