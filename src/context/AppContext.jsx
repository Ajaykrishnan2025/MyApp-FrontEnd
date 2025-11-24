// src/context/AppContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

// ✅ Use your deployed backend URL
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get("/api/auth/is-auth", { withCredentials: true });

      if (data.success) {
        await getUserData();
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      // ✅ handle 401 gracefully
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/data", { withCredentials: true });

      if (data.success) {
        setUserData(data.userData || data.user);
      } else {
        // ✅ if 401, don’t break the app
        if (data.message === "Not authenticated") {
          console.warn("User not authenticated yet");
        } else {
          toast.error("Failed to load user data");
        }
      }
    } catch (error) {
      // ✅ catch Axios 401 error
      if (error.response?.status === 401) {
        console.warn("Local dev: user not logged in, ignoring 401");
        setUserData(null);
        setIsLoggedin(false);
      } else {
        console.error("User data error:", error);
        toast.error("Failed to load user data");
      }
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
