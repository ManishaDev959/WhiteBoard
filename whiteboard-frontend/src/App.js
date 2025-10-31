import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Trash from "./pages/Trash";
import { UserProvider } from "./contexts/UserContext";

// Private route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const role = localStorage.getItem("role");

  return (
    <UserProvider>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes (wrapped with Layout) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {role === "Admin" && (
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          )}

          {role === "User" && (
            <Route path="/user-dashboard" element={<UserDashboard />} />
          )}

           {role === "User" && (
            <Route path="/trash" element={<Trash />} />
          )}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}
