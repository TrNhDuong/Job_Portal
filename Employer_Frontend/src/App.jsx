import React, { useState } from "react";
import Homepage from "./pages/Homepage";
import EmployerLogin from "./pages/employerLogin";
import EmployerRegister from "./pages/employerRegister";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const [showRegister, setShowRegister] = useState(false);

  if (!loggedIn) {
    return showRegister ? (
      <EmployerRegister onRegister={() => setShowRegister(false)} />
    ) : (
      <EmployerLogin
        onLogin={() => setLoggedIn(true)}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  return <Homepage />;
}

export default App;
