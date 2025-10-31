import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-500 text-sm py-3 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Left side */}
        <p>
          © {new Date().getFullYear()} <span className="text-cyan-600 font-semibold">WhiteBoard</span>. 
          All rights reserved.
        </p>

        {/* Right side (optional links) */}
        <div className="space-x-4 hidden sm:block">
          <a href="/privacy" className="hover:text-cyan-600 transition">Privacy</a>
          <a href="/terms" className="hover:text-cyan-600 transition">Terms</a>
          <a href="/support" className="hover:text-cyan-600 transition">Support</a>
        </div>
      </div>
    </footer>
  );
}
