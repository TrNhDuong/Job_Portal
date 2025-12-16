import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext.jsx"; 

import "../index.css";
import "./styles/register.css";
import "./styles/style.css";
import "./styles/login.css";
import "./styles/navbar.css"; 
import "./styles/home.css";
import "./styles/application.css";
import "./styles/dashboard.css";
import "./styles/mycv.css";
import "./styles/verify-otp.css";
import "./styles/password-setting.css";
import "./styles/security-settings.css";
import "./styles/job-search.css";
import "./styles/notification-settings.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);