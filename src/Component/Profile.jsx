import React, { useState } from "react";
import { useAuth } from "./../AuthContext"; // Import AuthContext
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { user, logout } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl text-red-500">Not Logged in</p>
      </div>
    );
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/change-password",
        {
          email: user.email,
          new_password: newPassword,
          old_password: oldPassword,
        }
      );

      if (response.data.status === "success") {
        setPasswordSuccess("Password changed successfully.");
        setPasswordError("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError("Failed to change password. Please try again.");
        setPasswordSuccess("");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("An error occurred. Please try again later.");
      setPasswordSuccess("");
    }
  };

  return (
    <div className="p-4 mt-12 mb-4 max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="mb-6">
        <p className="text-lg font-medium">
          Email: <span className="font-normal">{user.email}</span>
        </p>
      </div>
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium mb-1"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium mb-1"
          >
            Old Password
          </label>
          <input
            type="password"
            id="old-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {passwordError && <p className="text-red-500">{passwordError}</p>}
        {passwordSuccess && <p className="text-green-500">{passwordSuccess}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-600"
        >
          Change Password
        </button>
      </form>
      <button
        onClick={logout}
        className="w-full mt-4 bg-gray-500 text-white rounded py-2 hover:bg-gray-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
