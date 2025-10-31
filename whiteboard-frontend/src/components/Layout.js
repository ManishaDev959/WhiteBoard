import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 pt-16"> 
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 shadow-sm fixed top-16 bottom-0 left-0">
          <Sidebar />
        </aside>

        {/* Page Content */}
        <main className="flex-1 ml-64 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}
