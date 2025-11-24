// src/components/Header.jsx
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userData, loadingUser } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center">
      {/* Header Image */}
      <img
        src={assets.header_img}
        alt="Header"
        className="w-36 h-36 rounded-full mb-6"
      />

      {/* Greeting Section */}
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        {loadingUser ? "Loading..." : `Hey ${userData ? userData.name : 'Developer'}!`}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="Wave" />
      </h1>

      {/* Welcome Text */}
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our Gemini😉
      </h2>

      {/* Description */}
      <p className="mb-8 max-w-md">
        Let’s explore how Gemini AI can help you create, learn, and chat smarter — all in one place!
      </p>

      {/* Chatbot Button: only visible when user is loaded */}
      {!loadingUser && userData && (
        <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
          Open Chatbot
        </button>
      )}
    </div>
  );
};

export default Header;
