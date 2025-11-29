import { useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Login from "./pages/Login";
import Home from "./pages/Home";

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
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
