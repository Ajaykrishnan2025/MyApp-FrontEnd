import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setIsLoggedin, getUserData } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  axios.defaults.withCredentials = true; // ✅ ensure cookies sent

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post("/api/auth/register", formData);

        if (data.success) {
          toast.success("Registered successfully! Please verify your email.");
          localStorage.setItem("verifyEmail", formData.email);
          navigate("/email-verify");
        } else toast.error(data.message);
      } else {
        const { data } = await axios.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // ✅ ignore backend 400 message in console, show toast only
        if (!data.success && data.message === "Please verify your email before login") {
          toast.warning(data.message);
          localStorage.setItem("verifyEmail", formData.email);
          navigate("/email-verify");
          return;
        }

        if (data.success) {
          toast.success("Login successful!");
          setIsLoggedin(true);
          await getUserData();
          localStorage.setItem("token", data.token);
          localStorage.setItem("isVerified", "true");
          navigate("/");
        } else toast.error(data.message);
      }
    } catch (error) {
      // ✅ only show toast, no console.log for 400
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl px-8 py-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {state === "Sign Up" ? "Sign up to get started" : "Login to your account"}
        </p>

        {state === "Sign Up" && (
          <div className="mb-4">
            <label className="text-gray-600 text-sm mb-1 block">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="text-gray-600 text-sm mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-600 text-sm mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            required
          />
        </div>

        <p
          onClick={() => navigate("/reset-password")}
          className="text-right text-sm text-purple-600 hover:text-purple-800 hover:underline cursor-pointer mb-4"
        >
          Forgot password?
        </p>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
        >
          {state === "Sign Up" ? "Sign Up" : "Login"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                className="text-purple-600 cursor-pointer hover:underline"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-purple-600 cursor-pointer hover:underline"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
