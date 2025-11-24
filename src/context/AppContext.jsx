// src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

// ✅ Updated backend URL to Render
export const backendUrl = "https://auth-backend-rr3t.onrender.com";

axios.defaults.withCredentials = true; // ✅ ensure cookies sent
axios.defaults.baseURL = backendUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getAuthState = async () => {
    try {
      // ✅ FIXED ROUTE
      const { data } = await axios.get("/api/auth/is-auth", { withCredentials: true });

      if (data.success) {
        await getUserData();
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const getUserData = async () => {
    try {
      // ✅ send cookies for cross-site request
      const { data } = await axios.get("/api/user/data", { withCredentials: true });

      if (data.success) {
        setUserData(data.userData || data.user);
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      console.error("User data error:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });

      if (data.success) {
        await getUserData();
        setIsLoggedin(true);
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login error");
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post("/api/auth/logout", {}, { withCredentials: true });

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    backendUrl,
    login,
    logout,
    loadingUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
