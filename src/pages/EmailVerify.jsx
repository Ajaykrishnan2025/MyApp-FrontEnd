import React, { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { getUserData, userData } = useContext(AppContext);

  const inputRefs = useRef([]);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();

    const email =
      userData?.email ||
      localStorage.getItem("verifyEmail") ||
      localStorage.getItem("registerEmail") ||
      localStorage.getItem("email");

    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/login");
    }
  }, [navigate, userData]);

  const handleInput = (e, index) => {
    const val = e.target.value;
    if (val && !/^\d$/.test(val)) {
      e.target.value = "";
      return;
    }
    if (val.length > 0 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    const digits = paste.replace(/\D/g, "").slice(0, 6).split("");
    digits.forEach((ch, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = ch;
    });
    if (digits.length === 6) {
      setTimeout(() => {
        inputRefs.current[5]?.focus();
      }, 50);
    }
  };

  const collectOtp = () => inputRefs.current.map(inp => inp?.value || "").join("").trim();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const otp = collectOtp();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const email =
        userData?.email ||
        localStorage.getItem("verifyEmail") ||
        localStorage.getItem("registerEmail") ||
        localStorage.getItem("email");

      if (!email) {
        toast.error("Email not found. Please register again.");
        navigate("/login");
        return;
      }

      // ✅ Relative path instead of backendUrl
      const { data } = await axios.post(
        "/api/auth/verify-account",
        { email, otp }
      );

      if (data.success) {
        toast.success(data.message || "Email verified successfully ✅");

        localStorage.removeItem("registerEmail");
        localStorage.removeItem("verifyEmail");
        localStorage.setItem("isVerified", "true");

        if (typeof getUserData === "function") await getUserData();

        navigate("/login");
      } else {
        toast.error(data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      const backendMsg = error.response?.data?.message;
      toast.error(backendMsg || "Server error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 relative">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-lg"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 text-sm border border-indigo-300/30"
      >
        <h1 className="text-white text-3xl font-bold text-center mb-4 drop-shadow-md">
          Verify Your Email
        </h1>
        <p className="text-center mb-6 text-indigo-100 font-medium">
          Enter the 6-digit OTP sent to your email address
        </p>

        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              required
              className="w-12 h-12 bg-white/20 text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white/30 transition-all"
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-700/40"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
