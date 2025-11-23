import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Chatbot = () => {
  const navigate = useNavigate();
  const { isLoggedin, userData } = useContext(AppContext); // ✅ use AppContext
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hey! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    // ✅ redirect if not logged in or no user data
    if (!isLoggedin || !userData) {
      toast.error("Please login to use the chatbot.");
      navigate("/login");
    }
  }, [isLoggedin, userData, navigate]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/chatbot`, { message: input });

      const botMsg = {
        sender: "bot",
        text: data.reply || "Sorry, I didn’t understand that.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      toast.error("Chat request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">AI Chatbot 🤖</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          Home
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                msg.sender === "user"
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-500 italic text-sm">Bot is typing...</div>}
      </div>

      <form onSubmit={sendMessage} className="bg-white shadow-inner p-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
