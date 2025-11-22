import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

// ✅ Live backend URL
export const backendUrl = "https://auth-backend-4osh.onrender.com";

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Send cookies with every request
  axios.defaults.withCredentials = true;

  // ----------------------
  // Check Auth
  // ----------------------
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      // ✅ Only log unexpected errors
      if (!error.response || error.response.status !== 401) {
        console.error("Auth check response error:", error);
      }
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  // ----------------------
  // Get User Data
  // ----------------------
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData || data.user || data);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      // ✅ Ignore 401 errors silently
      if (!error.response || error.response.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to fetch user data");
      }
    }
  };

  // ----------------------
  // On mount: check auth
  // ----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isVerified = localStorage.getItem("isVerified") === "true";

    if (token && isVerified) {
      setIsLoggedin(true);
    }

    getAuthState();
  }, []);

  // ----------------------
  // Login function (example usage)
  // ----------------------
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      if (data.success) {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("isVerified", "true");

        setIsLoggedin(true);
        await getUserData();
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login error");
    }
  };

  const value = {
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    backendUrl,
    login, // Export login for usage in components
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
