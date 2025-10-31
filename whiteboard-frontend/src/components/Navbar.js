import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; // clean icon for sidebar toggle (optional)

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("role");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="flex justify-between items-center px-6 py-2 h-14">
        {/* Left section: logo + title */}
        <div className="flex items-center space-x-3">
          {/* Placeholder icon / logo */}
          <div
            className="bg-cyan-600 text-white font-bold text-lg px-3 py-1 rounded-md cursor-pointer"
            onClick={() =>
              navigate(role === "Admin" ? "/admin-dashboard" : "/user-dashboard")
            }
          >
            WB
          </div>
          <span className="text-lg font-semibold text-gray-700 tracking-tight">
            WhiteBoard
          </span>
        </div>

        {/* Center section (optional — for doc name / breadcrumbs) */}
        <div className="hidden md:block text-gray-500 font-medium">
          {role === "Admin" ? "Admin Workspace" : "My Documents"}
        </div>

        {/* Right section: user + dropdown */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-gray-700 font-medium">
                {username}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100">
                <button
                  onClick={() =>
                    navigate(role === "Admin" ? "/admin-dashboard" : "/user-dashboard")
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
