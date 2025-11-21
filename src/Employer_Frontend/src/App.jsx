import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';

import Homepage from './pages/Homepage.jsx';
import LoginPage from './pages/employerLogin.jsx';     
import RegisterPage from './pages/employerRegister.jsx'; 
//THANH TOÁN
import EmployerDeposit from './pages/EmployerDeposit.jsx'; 
import EmployerJobRenewal from './pages/EmployerJobRenewal.jsx';


export default function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" />} />

      <Route 
        path="/login" 
        element={<LoginPage />} 
      />

      <Route 
        path="/register" 
        element={<RegisterPage />} 
      />

      <Route
        path="/homepage"
        element={
            <Homepage />
        }
      />

      {/* THANH TOÁN */}
      <Route
        path="/deposit"
        element={
            <EmployerDeposit />
        }
      />
      <Route
        path="/renewal"
        element={
            <EmployerJobRenewal />
        }
      />

    </Routes>
  );
}