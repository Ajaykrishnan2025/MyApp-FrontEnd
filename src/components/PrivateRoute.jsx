import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isVerified = localStorage.getItem("isVerified") === "true";
  if (!token) return <Navigate to="/login" />;
  if (!isVerified) return <Navigate to="/email-verify" />;
  return children;
};

export default PrivateRoute;