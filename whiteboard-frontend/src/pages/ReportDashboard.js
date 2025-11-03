import React, { useState } from "react";
import ReportFilters from "./ReportsFilters";

export default function ReportsDashboard() {
  const [reportData, setReportData] = useState(null);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Documents Report</h1>

      {/* Filters Section */}
      <ReportFilters onSearch={(data) => setReportData(data)} />

      {/* Results Section */}
      {reportData && (
        <div className="bg-white shadow rounded-xl p-6 mt-4">
          {reportData.totalCount > 0 ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Documents: {reportData.totalCount}
                </h2>

                <button
                  onClick={() => alert("Export to PDF will be added soon!")}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition"
                >
                  Export to PDF
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg text-sm">
                  <thead className="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                      <th className="px-4 py-2 border text-left w-16">#</th>
                      <th className="px-4 py-2 border text-left">Owner Name</th>
                      <th className="px-4 py-2 border text-left">Document Title</th>
                      {/* <th className="px-4 py-2 border text-left">Content (Preview)</th> */}
                      <th className="px-4 py-2 border text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.documents.map((doc, index) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        <td className="px-4 py-2 border text-gray-700 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {doc.ownerName || "—"}
                        </td>
                        <td className="px-4 py-2 border text-gray-700 font-semibold">
                          {doc.title || "Untitled"}
                        </td>
                        {/* <td className="px-4 py-2 border text-gray-600 truncate max-w-xs">
                          {doc.content
                            ? doc.content.substring(0, 80) +
                              (doc.content.length > 80 ? "..." : "")
                            : ""}
                        </td> */}
                        <td className="px-4 py-2 border text-gray-600">
                          {doc.createdAt
                            ? new Date(doc.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            // ❌ No Data Found
            <p className="text-gray-500 text-center py-8 text-lg">
              No documents found for the selected duration.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
