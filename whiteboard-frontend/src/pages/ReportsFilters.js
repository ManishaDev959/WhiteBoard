import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// ✅ Extract userId from token (if needed later)
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.sub; // adjust if JWT structure differs
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

// ✅ Format date as YYYY-MM-DD (local time safe)
function formatLocalDate(input) {
  if (!input) return "";
  const date = input instanceof Date ? input : new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ReportFilters({ onSearch }) {
  const [duration, setDuration] = useState("today");
  const [searchQuery, setSearchQuery] = useState({
    fromDate: "",
    toDate: "",
    userId: "",
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // 🕒 Update from/to dates based on duration
  useEffect(() => {
    const now = new Date();
    let start, end;

    switch (duration) {
      case "today":
        start = new Date(); // today (local)
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
        start = "";
        end = "";
    }

    if (duration !== "custom") {
      const formattedFrom = formatLocalDate(start);
      const formattedTo = formatLocalDate(end);

      console.log(`📅 Duration: ${duration}`);
      console.log(`From: ${formattedFrom} | To: ${formattedTo}`);

      setSearchQuery((prev) => ({
        ...prev,
        fromDate: formattedFrom,
        toDate: formattedTo,
      }));
    }
  }, [duration]);

  // 🔍 Handle Report Generation
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.fromDate && !searchQuery.toDate) {
      setMessage("Please fill at least one field to generate the report.");
      return;
    }

    try {
      const payload = {
        StartDate: searchQuery.fromDate,
        EndDate: searchQuery.toDate,
        UserId: searchQuery.userId || "",
      };

      console.log("📤 Sending payload:", payload);

      const res = await fetch("http://localhost:5153/api/Reports/documents-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("✅ Received report data:", data);

      onSearch?.(data); // Pass data to parent component
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  // 🟡 Handle manual date input (for custom)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white shadow p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      {/* Duration Dropdown */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Date Pickers (only for Custom Duration) */}
      {duration === "custom" && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={searchQuery.fromDate}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              name="toDate"
              value={searchQuery.toDate}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
        </>
      )}

      {/* Generate Report Button */}
      <div>
        <button
          onClick={handleSearch}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md w-full hover:bg-cyan-700 transition"
        >
          Generate Report
        </button>
      </div>

      {/* Validation Message */}
      {message && (
        <p className="col-span-full text-red-500 text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
