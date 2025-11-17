// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./home/Homepage.jsx"; 
import Navbar from "./components/Navbar.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage.jsx";
import CandidateDashboard from "./pages/CandidateDashboard.jsx"; 
import ApplicationPage from "./pages/ApplicationPage.jsx";
import ApplicationStatusPage from "./pages/ApplicationStatusPage.jsx";
import JobManagement from "./pages/JobManagement.jsx";         
import MyCV from "./pages/MyCV.jsx";                           
import NotificationSettings from "./pages/NotificationSettings.jsx";
import ProfileSettings from './pages/settings/ProfileSettings.jsx';
import PasswordSettings from './pages/settings/PasswordSettings.jsx';
import SecuritySettings from './pages/settings/SecuritySettings.jsx';
import AppliedJobsPage from './pages/AppliedJobsPage.jsx';
import SavedJobsPage from './pages/SavedJobsPage.jsx';
import JobSearchPage from "./pages/JobSearchPage.jsx";
function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page-container">
        <Routes> 
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/login-page" element={<Login />} />
          <Route path="/jobs/:id/apply" element={<ApplicationPage />} />
          <Route path="/jobs/:id/status" element={<ApplicationStatusPage />} />
          <Route path="/dashboard" element={<CandidateDashboard />}>
            <Route index element={<JobManagement />} />
            <Route path="my-cv" element={<MyCV />} />
            <Route path="settings/profile" element={<ProfileSettings />} />
            <Route path="settings/password" element={<PasswordSettings />} />
            <Route path="settings/security" element={<SecuritySettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="applied-jobs" element={<AppliedJobsPage />} />
            <Route path="saved-jobs" element={<SavedJobsPage />} /> 
          </Route>

        </Routes>
      </div>
    </div>
  );
}

export default App;