// 📁 client/src/components/GeminiChatPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar.jsx";
import PromptCard from "./PromptCard.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import { assets } from "../assets/assets.js";
import { Navigate } from "react-router-dom";

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

  const sendPromptToGemini = async (prompt) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

    try {
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          return "Your Gemini API key is invalid or leaked. Please update the key.";
        }
        return data.error || "Sorry, the AI server had a problem. Please try again later.";
      }

      return data.reply || "No response from Gemini model.";
    } catch (error) {
      console.error("Error fetching from backend:", error);
      return "Sorry, I'm having trouble connecting to the backend. Please make sure it's running.";
    }
  };

  const handleSendPrompt = async () => {
    if (!inputPrompt.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputPrompt };
    setChatHistory((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const aiResponseContent = await sendPromptToGemini(inputPrompt);
      const aiMessage = { role: "model", content: aiResponseContent };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending prompt:", error);
      setChatHistory((prev) => [
        ...prev,
        { role: "model", content: "Sorry, I ran into an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptCardClick = (promptText) => setInputPrompt(promptText);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div
            className="bg-white text-gray-800 rounded-2xl overflow-hidden shadow-xl flex"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <Sidebar />
            <main className="flex-1 p-10 flex flex-col">
              <div className="flex-1 overflow-y-auto pr-4">
                {chatHistory.length === 0 ? (
                  <div className="welcome-screen">
                    <header className="flex justify-between items-start">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold">
                          <span className="text-blue-500">Hello,</span>
                          <span className="text-pink-500"> This is GeminiChatbot🤖</span>
                        </h1>
                        <p className="mt-2 text-xl text-gray-400">
                          Your smart AI assistant ready to help you — powered by Gemini!
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img
                          src={assets.avatar}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    </header>
                    <section className="mt-12">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {samplePrompts.map((prompt, idx) => (
                          <div onClick={() => handlePromptCardClick(prompt)} key={idx}>
                            <PromptCard text={prompt} />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="message-list space-y-6">
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl max-w-lg ${
                            message.role === "user"
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="p-4 rounded-2xl max-w-lg bg-gray-100 text-blue-500 rounded-bl-none">
                          <p>Gemini is thinking...</p>
                        </div>
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
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                  />
                  <div className="flex items-center space-x-3 ml-4">
                    <button className="p-2 rounded-full hover:bg-gray-100" disabled={isLoading}>
                      📎
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100" disabled={isLoading}>
                      🎤
                    </button>
                    <button
                      className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full disabled:bg-blue-300"
                      onClick={handleSendPrompt}
                      disabled={isLoading || !inputPrompt.trim()}
                    >
                      Send
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-blue-500 text-center">
                  Gemini may display inaccurate info, including about people, so please double-check responses.
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
