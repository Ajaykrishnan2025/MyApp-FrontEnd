import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
