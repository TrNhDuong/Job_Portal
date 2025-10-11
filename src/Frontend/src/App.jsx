import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
