import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [documentCount, setDocumentCount] = useState(0);
  const [deletedDocumentCount, setDeletedDocumentCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchCounts = async () => {
      try {
        const [activeRes, deletedRes] = await Promise.all([
          fetch("http://localhost:5153/api/Documents/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5153/api/Documents/deleted-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!activeRes.ok || !deletedRes.ok) throw new Error("Failed to fetch counts");
        const activeCount = await activeRes.json();
        const deletedCount = await deletedRes.json();

        setDocumentCount(activeCount.count);
        setDeletedDocumentCount(deletedCount.count);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <UserContext.Provider
      value={{
        documentCount,
        setDocumentCount,
        deletedDocumentCount,
        setDeletedDocumentCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
