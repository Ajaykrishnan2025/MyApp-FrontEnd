// 📁 client/src/components/Navbar.jsx

import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    userData,
    setUserData,
    setIsLoggedin,
    isLoggedin,
    backendUrl,
  } = useContext(AppContext);

  // ---------------------------
  // SEND VERIFICATION OTP
  // ---------------------------
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        { userId: userData?._id },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP send failed");
    }
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);

        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("isVerified");

        toast.success("Logged out");
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 left-0">
      {/* LOGO */}
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* RIGHT SIDE - LOGIN OR USER MENU */}
      {isLoggedin ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-700 text-white relative group cursor-pointer">
          {userData?.name?.[0]?.toUpperCase()}

          {/* DROPDOWN MENU */}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm shadow-lg rounded">
              {!userData?.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow Icon" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
