// src/components/GeminiChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar.jsx";
import PromptCard from "./PromptCard.jsx";
import { assets } from "../assets/assets.js";
import PrivateRoute from "./PrivateRoute.jsx";

const GeminiChatPage = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const samplePrompts = [
    "Suggest beautiful places to see on an upcoming road trip",
    "Briefly summarize this concept: urban planning",
    "Brainstorm team bonding activities for our work retreat",
    "Improve the readability of the following code",
  ];

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const sendPromptToGemini = async (prompt) => {
    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      if (!res.ok) return data.error || "Server error";
      return data.reply || "No response";
    } catch (err) {
      console.error(err);
      return "Unable to reach backend";
    }
  };

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim() || isLoading) return;
    const userMessage = { role: "user", content: inputPrompt };
    setChatHistory([...chatHistory, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    const aiResponse = await sendPromptToGemini(inputPrompt);
    const aiMessage = { role: "model", content: aiResponse };
    setChatHistory((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handlePromptCardClick = (prompt) => setInputPrompt(prompt);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl flex" style={{ height: "calc(100vh - 4rem)" }}>
            <Sidebar />
            <main className="flex-1 p-10 flex flex-col">
              <div className="flex-1 overflow-y-auto pr-4">
                {chatHistory.length === 0 ? (
                  <div>
                    <header className="flex justify-between items-start">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                          <span className="text-blue-500">Hello,</span> 
                          <span className="text-pink-500"> GeminiChatbot 🤖</span>
                        </h1>
                        <p className="mt-2 text-xl text-gray-400">
                          Your AI assistant powered by Gemini!
                        </p>
                      </div>
                      <img src={assets.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                    </header>
                    <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {samplePrompts.map((prompt, i) => (
                        <PromptCard key={i} text={prompt} onClick={() => handlePromptCardClick(prompt)} />
                      ))}
                    </section>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`p-4 rounded-2xl max-w-lg ${msg.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"}`}>
                          <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="p-4 rounded-2xl max-w-lg bg-gray-700 text-blue-400 rounded-bl-none">Gemini is thinking...</div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              <footer className="mt-8">
                <div className="bg-gray-50 border border-gray-100 rounded-full px-4 py-3 flex items-center shadow-sm">
                  <input
                    className="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400"
                    placeholder="Enter a prompt here"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyPress={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendPrompt(); } }}
                  />
                  <button
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full disabled:bg-blue-300"
                    onClick={handleSendPrompt}
                    disabled={isLoading || !inputPrompt.trim()}
                  >
                    Send
                  </button>
                </div>
                <p className="mt-3 text-xs text-blue-500 text-center">
                  Gemini may display inaccurate info, double-check responses.
                </p>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default GeminiChatPage;
