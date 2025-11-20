import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- IMPORT
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  
    <AuthProvider>
      {/* Bọc App bằng Router */}
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </AuthProvider>
);