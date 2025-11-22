import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import EmailVerify from "./pages/EmailVerify.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Chatbot from "./pages/chatbot.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";  // ✔ Correct
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GeminiChatPage from "./components/GeminiChatPage.jsx";

const App = () => (
  <div>
    <ToastContainer />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/chatbot"
        element={
          <PrivateRoute>
            <Chatbot />
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <GeminiChatPage />
          </PrivateRoute>
        }
      />
    </Routes>
  </div>
);

export default App;
