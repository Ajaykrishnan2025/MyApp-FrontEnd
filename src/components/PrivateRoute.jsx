// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);

  // While auth is being checked (first 300-500ms)
  if (isLoggedin === false && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → allow access
  if (isLoggedin) {
    return children;
  }

  return null; // prevents flicker
};

export default PrivateRoute;
