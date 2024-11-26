import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./../AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAdmin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin-login",
        { email, password }
      );
      if (response.data.success) {
        sessionStorage.setItem("user", JSON.stringify(response.data.admin));
        setAdmin({ email });
        navigate("/admin/"); // Redirect to admin profile
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mb-4">
      <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm  text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 text-gray-700 rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-tealish text-white rounded py-2 hover:bg-teal-600"
        >
          Login
        </button>
      </form>
      {/* <p className="text-center mt-6 text-gray-600 text-sm">
        Don't have an account?{" "}
        <Link
          to="/admin/signup"
          className="text-blue-500 hover:text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </p> */}
    </div>
  );
};

export default AdminLogin;
