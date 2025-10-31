import { useEffect, useState, useCallback } from "react";
import { useUserContext } from "../contexts/UserContext";

export default function Trash() {
  const [deletedDocs, setDeleteDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { setDocumentCount, setDeletedDocumentCount } = useUserContext();

  // ✅ Define fetchDeletedDocuments outside useEffect so we can reuse it
  const fetchDeletedDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5153/api/Documents/trash", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch deleted documents");

      const data = await response.json();
      setDeleteDocs(data);
    } catch (err) {
      console.error("Error fetching deleted documents:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Fetch deleted docs on mount
  useEffect(() => {
    fetchDeletedDocuments();
  }, [fetchDeletedDocuments]);

  // ✅ Restore handler
  const handleRestore = async (id) => {
    try {
      const response = await fetch(`http://localhost:5153/api/Documents/restore/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("✅ Document restored successfully");

        // Update global counts
        setDocumentCount((prev) => prev + 1);
        setDeletedDocumentCount((prev) => prev - 1);

        // Refresh trash list
        fetchDeletedDocuments();
      } else {
        alert("❌ Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  // ✅ Loading state
  if (loading) {
    return <div className="p-8 text-gray-600">Loading deleted documents...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trash</h1>

      {deletedDocs.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-center text-gray-500">
          No deleted documents found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-100">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="border-b bg-cyan-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Content</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {deletedDocs.map((doc) => (
                <tr key={doc.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{doc.title}</td>
                  <td className="py-3 px-4 text-gray-600 truncate max-w-xs">
                    {doc.content || "No content"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRestore(doc.id)}
                      className="text-cyan-600 hover:underline font-medium"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
