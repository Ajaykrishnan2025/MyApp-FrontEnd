// src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

// ✅ Use your deployed backend URL
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
// ✅ Include credentials for cross-site cookies
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // -------------------------
  // GET AUTH STATE
  // -------------------------
  const getAuthState = async () => {
    try {
      const { data } = await axios.get("/api/auth/is-auth", {
        withCredentials: true,
      });

      if (data.success) {
        await getUserData();
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Auth state error:", error);
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // -------------------------
  // GET USER DATA
  // -------------------------
  const getUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/data", {
        withCredentials: true, // ✅ ensures cookie sent
      });

      if (data.success) {
        setUserData(data.userData || data.user);
      } else {
        toast.error("Failed to load user data");
        setUserData(null);
      }
    } catch (error) {
      console.error("User data error:", error);
      setUserData(null);
    }
  };

  // -------------------------
  // LOGIN
  // -------------------------
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        await getUserData();
        setIsLoggedin(true);
        toast.success("Login successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login error");
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out");
      }
    } catch (error) {
      console.error("Logout error:", error);
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
