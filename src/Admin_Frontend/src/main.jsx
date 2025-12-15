import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import Provider từ file Context mới sửa
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode> // Có thể bật/tắt tùy ý, tắt để đỡ log 2 lần khi dev
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  // </React.StrictMode>,
);