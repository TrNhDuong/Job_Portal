import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";  // <-- nhớ import
import "./styles/login.css";
import "./styles/transition.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>       {/* <-- QUẤN NÈ */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
