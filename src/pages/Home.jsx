import React, { useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedin } = useContext(AppContext);

  const token = localStorage.getItem("token");
  const isVerified = localStorage.getItem("isVerified") === "true";

  // 🔥 FIXED (only this line changed)
  const isAuthenticated =
    isLoggedin &&
    token &&
    isVerified;

  return (
    <div className="min-h-screen flex flex-col bg-center bg-cover bg-[url('/bg_img.png')]">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <Header />

        {isAuthenticated && (
          <button
            onClick={() => navigate("/chat")}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all shadow-lg"
          >
            Open AI Chatbot
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
