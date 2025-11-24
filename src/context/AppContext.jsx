import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const isLocal = window.location.hostname === "localhost";

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
      if (!isLocal || error.response?.status !== 401) {
        console.error("Auth state error:", error);
      }
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
        toast.error("Failed to load user data");
      }
    } catch (error) {
      if (!isLocal || error.response?.status !== 401) {
        console.error("User data error:", error);
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

  return (
    <AppContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        backendUrl,
        login,
        logout,
        loadingUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
