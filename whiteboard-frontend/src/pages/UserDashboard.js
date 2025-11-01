import React, { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import { useUserContext } from "../contexts/UserContext";

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

export default function UserDashboard() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const { documentCount, setDocumentCount, deletedDocumentCount, setDeletedDocumentCount } =
    useUserContext();

  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken();
  const username = localStorage.getItem("username") || "User";


  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const startDictation = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    setIsListening(true);
    speak(`Hi ${username}, please say your title.`);

    const waitForSpeechEnd = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(waitForSpeechEnd);
        captureSpeech("title");
      }
    }, 500);
  };

  const captureSpeech = (field) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (field === "title") {
        setTitle(transcript);
        speak("Got it. Now please dictate your document content.");
        setTimeout(() => captureSpeech("content"), 2500);
      } else {
        setContent(transcript);
        speak("Thanks! I’ve captured your document. You can now save it.");
        setIsListening(false);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      speak("Sorry, I didn’t catch that. Please try again.");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopDictation = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    speak("Dictation stopped.");
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("http://localhost:5153/api/Documents/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
        setDocumentCount(data.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocuments();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const url = isEditing
        ? `http://localhost:5153/api/Documents/${editingDocId}`
        : "http://localhost:5153/api/Documents";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, ownerId: userId }),
      });

      if (!response.ok) throw new Error("Failed to save document");
      const updatedDoc = await response.json();

      if (isEditing) {
        setDocuments((docs) =>
          docs.map((d) => (d.id === editingDocId ? updatedDoc : d))
        );
        setIsEditing(false);
        setEditingDocId(null);
      } else {
        setDocuments((docs) => [...docs, updatedDoc]);
        setDocumentCount((prev) => prev + 1);
      }

      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setTitle(doc.title);
    setContent(doc.content);
    setEditingDocId(doc.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    await fetch(`http://localhost:5153/api/Documents/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDocuments(documents.filter((d) => d.id !== id));
    setDocumentCount((prev) => Math.max(prev - 1, 0));
    setDeletedDocumentCount((prev) => prev + 1);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingDocId(null);
    setTitle("");
    setContent("");
  };

  // ------------------------ UI ------------------------
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Document" : "Create New Document"}
          </h1>

          {/* 🎙️ Dictate Button */}
          {!isListening ? (
            <button
              onClick={startDictation}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              🎙️ Dictate
            </button>
          ) : (
            <button
              onClick={stopDictation}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              🛑 Stop
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-100"
        >
          <input
            className="border rounded-md px-3 py-2 w-full mb-3"
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border rounded-md px-3 py-2 w-full mb-3"
            placeholder="Document Content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Document"
                : "Create Document"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Document List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white shadow-md border border-gray-100 rounded-xl p-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{doc.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{doc.content}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-cyan-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No documents yet. Create one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
