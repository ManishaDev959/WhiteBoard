import React, { useEffectEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  Trash2,
  Settings,
  Menu,
  X,
  Share2,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(true);

 const {documentCount, deletedDocumentCount} = useUserContext();


  useEffect(() => {


  },[]);

  const commonLinks = [
    {
      name: `My Documents (${documentCount})`, 
      icon: <FileText size={18} />,
      path: "/user-dashboard",
    },
    { name: "Shared With Me", icon: <Share2 size={18} />, path: "/shared" },
    { name: `Trash (${deletedDocumentCount})`,  icon: <Trash2 size={18} />, path: "/trash" },
    { name: "Mentioned", icon: <Trash2 size={18} />, path: "/mentioned" },
  ];


  const adminLinks = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin-dashboard" },
    { name: "Manage Users", icon: <Users size={18} />, path: "/manage-users" },
    { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },
    { name: "Insights", icon: <BarChart3 size={18} />, path: "/insights" },
  ];

  return (
    <>
      {/* Toggle button for small screens */}
      <button
        className="md:hidden fixed top-16 left-4 z-40 bg-cyan-600 text-white p-2 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30
        ${isOpen ? "w-60" : "w-0 md:w-60"} overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {(role === "Admin" ? adminLinks : commonLinks).map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition"
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Settings Button */}
          <div className="border-t border-gray-100 p-4">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center space-x-3 text-gray-500 hover:text-cyan-600 w-full"
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
