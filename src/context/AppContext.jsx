// src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const backendUrl = "http://localhost:4000"; // ✅ correct backend

axios.defaults.withCredentials = true;
axios.defaults.baseURL = backendUrl;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ new loading flag

  const getAuthState = async () => {
    try {
      const { data } = await axios.get("/api/auth/is-auth");

      if (data.success) {
        await getUserData(); // fetch userData first
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false); // ✅ done loading
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

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
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.success) {
        await getUserData(); // ✅ fetch userData first
        setIsLoggedin(true);
        localStorage.setItem("isVerified", "true");
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
      const { data } = await axios.post("/api/auth/logout");

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);

        localStorage.removeItem("token");
        localStorage.removeItem("isVerified");

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
    loadingUser, // ✅ export flag
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
