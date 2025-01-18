import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "./../AuthContext"; // Import your AuthContext

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate
  const { setUser } = useAuth(); // Get setUser from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      if (response.data.status === "success") {
        setMessage("Login successful!");
        setError("");
        setUser({ email }); // Set the logged-in user
        navigate("/commentanalyzer"); // Redirect to home page
      }
    } catch (error) {
      setError("Invalid email or password. Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center min-h-screen-100 bg-gray-100 p-5">
      <div className="w-full max-w-sm p-8 mt-10 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-montserrat text-blue-500 text-center mb-6">
          Login
        </h2>
        <form className="flex flex-col" onSubmit={handleLogin}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 font-montserrat text-gray-700 text-sm"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 font-montserrat text-gray-700 text-sm"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && (
            <p className="text-green-500 text-center mb-4">{message}</p>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-[rgb(202,0,42)] text-white rounded-md hover:green-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[rgb(202,0,42)] hover:text-green-500   hover:underline"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;