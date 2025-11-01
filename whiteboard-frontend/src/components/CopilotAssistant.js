import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion } from "framer-motion";

const CopilotAssistant = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askCopilot = async (e) => {
    debugger
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      debugger
      const res = await fetch("http://localhost:5153/api/Copilot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optional: include auth header if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("Copilot API error");
      }

      const data = await res.json();
      const aiMsg = { role: "assistant", content: data.response || "No response." };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setQuery("");
      setLoading(false);
    }
  };

  const onModalClose = () =>
  {
      setOpen(false);
      setMessages([]);
  }

  return (
    <>
      {/* Floating Copilot Button */}
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50"
          whileHover={{ scale: 1.1 }}
        >
          <MessageSquare size={24} />
        </motion.button>
      )}

      {/* Copilot Panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-white shadow-xl rounded-2xl w-96 h-[500px] flex flex-col border z-50"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg">Waxy Your Personal AI chat assistant</h2>
            <button onClick={onModalClose}>
              <X className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  m.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <p className="text-gray-400 italic">🤖 Copilot is thinking...</p>
            )}
          </div>

          {/* Input */}
          <form onSubmit={askCopilot} className="border-t p-3 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Copilot..."
              className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
};

export default CopilotAssistant;
