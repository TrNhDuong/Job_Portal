import React, { useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LoginForm from "./components/LoginForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./home/HomePage"; 
import Navbar from "./components/Navbar.jsx";

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <div className="app-wrapper">
      <Navbar />
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames="page"
          timeout={600}
          nodeRef={nodeRef}
          unmountOnExit
        >
          <div ref={nodeRef} className="page-container">
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login-page" element={<Login />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
