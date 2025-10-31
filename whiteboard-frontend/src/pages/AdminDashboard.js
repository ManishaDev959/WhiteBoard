import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5153/api/Users/today", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Fetch users on initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  // ⚡ SignalR Live Connection
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5153/adminHub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => console.log("✅ Connected to SignalR hub"))
      .catch(err => console.error("❌ SignalR Connection Error:", err));

    // 🧩 Listen for UserRegistered events
    connection.on("UserRegistered", (data) => {
      console.log("📢 New user registered:", data);

      // 1️⃣ Show in live notifications
      setNotifications((prev) => [
        {
          message: `👤 ${data.name} just registered (${data.email})`,
          time: new Date(data.registeredAt),
        },
        ...prev,
      ]);

      // 2️⃣ Refresh user list dynamically
      fetchUsers();
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(0, 5)); // keep latest 5
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);


  function formatTimeAgo(timestamp) {
    if (!timestamp) return "—";

    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past; // difference in milliseconds
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `${diffSec} sec${diffSec !== 1 ? "s" : ""} ago`;
    if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  }


  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-cyan-700 mb-8">Admin Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-xl p-6 border border-gray-100 hover:shadow-md transition">
          <h3 className="text-gray-600 text-sm mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-cyan-600">{users.length}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 border border-gray-100 hover:shadow-md transition">
          <h3 className="text-gray-600 text-sm mb-2">Active Documents</h3>
          <p className="text-3xl font-bold text-cyan-600">17</p>
        </div>

        <div className="bg-white shadow rounded-xl p-6 border border-gray-100 hover:shadow-md transition">
          <h3 className="text-gray-600 text-sm mb-2">Storage Used</h3>
          <p className="text-3xl font-bold text-cyan-600">2.4 GB</p>
        </div>
      </div>


      {/* 🔔 Live Notifications */}
      <div className="bg-white mb-10 p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">No live events yet...</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n, i) => (
              <li key={i} className="py-3 flex justify-between text-gray-700">
                <span>{n.message}</span>
                <span className="text-gray-400 text-xs">
                  {n.time.toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* Today's Users Section */}
      <div className="bg-white mt-10 p-6 rounded-xl shadow border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Today’s Users</h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b bg-cyan-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4 text-center">Documents Created</th>
                <th className="py-3 px-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.username}</td>
                    <td className="py-3 px-4 text-center">{user.documentsCreatedToday ?? 0}</td>
                    <td className="py-3 px-4 text-right text-gray-400">
                      {formatTimeAgo(user.lastActive)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No users joined today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
