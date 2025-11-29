// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
import JobSearchPage from "./pages/JobSearchPage.jsx"; 
import AccountSettingsLayout from "./pages/settings/AccountSettingsLayout.jsx";
import ProfileSettings from "./pages/settings/ProfileSettings.jsx";
import PasswordSettings from "./pages/settings/PasswordSettings.jsx";
import SecuritySettings from "./pages/settings/SecuritySettings.jsx";
import MyJobsPage from "./pages/MyJobsPage.jsx";
function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/register", "/login", "/verify-otp"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen bg-background">
      {!shouldHideNavbar && (
        <div className="flex-none z-50">
          <Navbar />
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full overflow-y-auto">
          <Routes>
            <Route path="/jobs" element={<JobSearchPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/login-page" element={<Login />} />
            <Route path="/jobs/:id/apply" element={<ApplicationPage />} />
            <Route path="/jobs/:id/status" element={<ApplicationStatusPage />} />
            <Route path="/apply/:id" element={<ApplicationPage />} />
            <Route path="/dashboard" element={<CandidateDashboard />}>
              <Route index element={<MyJobsPage />} />
              <Route index element={<JobManagement />} />
              <Route path="my-cv" element={<MyCV />} />
              <Route path="settings" element={<AccountSettingsLayout />}>
                <Route index element={<ProfileSettings />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="password" element={<PasswordSettings />} />
                <Route path="security" element={<SecuritySettings />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}


export default App;