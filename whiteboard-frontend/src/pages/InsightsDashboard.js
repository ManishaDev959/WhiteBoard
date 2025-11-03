import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function InsightsDashboard() {
  const [insights, setInsights] = useState({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Helper to format date in local timezone
  const formatDate = (date) => date.toISOString().split("T")[0];

  // ✅ Fetch data for each duration
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const periods = ["today", "week", "month", "year"];
        const results = {};

        for (const period of periods) {
          const { StartDate, EndDate } = getDateRange(period);
          const res = await fetch("http://localhost:5153/api/Reports/documents-report", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ StartDate, EndDate, UserId: "" }),
          });
          const data = await res.json();
          results[period] = data.totalCount || 0;
        }

        setInsights(results);
      } catch (err) {
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [token]);

  // ✅ Get date ranges dynamically
  const getDateRange = (duration) => {
    const now = new Date();
    let start, end;

    switch (duration) {
      case "today":
        start = new Date();
        end = new Date();
        break;
      case "week":
        start = new Date();
        start.setDate(start.getDate() - 7);
        end = new Date();
        break;
      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date();
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date();
        break;
      default:
        start = end = new Date();
    }

    return {
      StartDate: formatDate(start),
      EndDate: formatDate(end),
    };
  };

  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF4444"];

  const chartData = [
    { name: "Today", value: insights.today },
    { name: "This Week", value: insights.week },
    { name: "This Month", value: insights.month },
    { name: "This Year", value: insights.year },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📈 Document Insights</h1>

      {loading ? (
        <p className="text-gray-600">Loading insights...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 📊 Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Documents Created Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🥧 Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Documents Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
