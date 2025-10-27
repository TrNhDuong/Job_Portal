import React, { useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LoginForm from "./components/LoginForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./Home/Homepage";

function App() {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <div className="app-wrapper">
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
              <Route path="/" element={<Navigate to="/login" />} />
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
