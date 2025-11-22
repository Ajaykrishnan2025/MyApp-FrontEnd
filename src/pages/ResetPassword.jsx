import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP & reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/send-reset-otp", { email });
      if (data.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 px-4">
      <form
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
        className="bg-white shadow-xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {step === 1
            ? "Enter your email to get OTP"
            : "Enter OTP and your new password"}
        </p>

        <div className="mb-4">
          <label className="text-gray-600 text-sm mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            required
            disabled={step === 2}
          />
        </div>

        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="text-gray-600 text-sm mb-1 block">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="text-gray-600 text-sm mb-1 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
        >
          {step === 1 ? "Send OTP" : "Reset Password"}
        </button>

        <p
          onClick={() => navigate("/login")}
          className="text-center mt-6 text-sm text-purple-600 hover:underline cursor-pointer"
        >
          Back to Login
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
