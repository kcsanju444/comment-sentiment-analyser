import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useAuth } from "./../AuthContext"; // Import your AuthContext
import "./Navbar.css";
import Logo from "../assets/mlogo.png";

function Navbar() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const { user, admin, logout } = useAuth(); // Get user and admin context or state

  const handleProfileClick = () => {
    setIsOverlayOpen((prev) => !prev); // Toggle the overlay visibility
  };

  // Hover event handlers
  const handleDropdownEnter = () => {
    setIsDropdownOpen(true); // Show dropdown on hover
  };

  const handleDropdownLeave = () => {
    setIsDropdownOpen(false); // Hide dropdown when mouse leaves
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false); // Close overlay
  };

  return (
    <div className="flex justify-between items-center bg-slate-50 border-b border-gray-300 p-4 sticky top-0 z-50">
      {/* Logo linking to HomeScreen */}
      <nav>
        <Link to="/">
          <img src={Logo} className="h-14" alt="logo" />
        </Link>
      </nav>
      
      {/* Analysis Dropdown */}
      <nav>
        <div
          className="relative"
          onMouseEnter={handleDropdownEnter} // Show dropdown on hover
          onMouseLeave={handleDropdownLeave} // Hide dropdown when mouse leaves
        >
          <button
            className="text-gray-800 font-semibold py-2 px-4 rounded inline-block"
          >
            Analysis
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white shadow-lg rounded mt-0 w-48 z-60">
              <ul className="list-none p-0">
                <li>
                  <Link
                    to="/twittercomment"
                    className="block py-2 px-4 text-gray-800 hover:bg-gray-200"
                  >
                    Twitter Comment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/commentanalyzer"
                    className="block py-2 px-4 text-gray-800 hover:bg-gray-200"
                  >
                    YouTube Comment
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>


      <h1 className="font-montserrat text-tealish text-xl"></h1>

      {/* Spam Detection */}
      <Link to="/spamdetection">
        <button className="bg-teal-500 text-white rounded hover:bg-teal-600 px-4 py-2">
          Spam Detection
        </button>
      </Link>
      
      {/* Profile Section */}
      {(user || admin) && (
        <>
          <CgProfile
            className="h-6 w-6 mr-4 cursor-pointer"
            onClick={handleProfileClick} // Open/close overlay on click
          />
          {isOverlayOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50"
              onClick={handleOverlayClose} // Close overlay when clicked outside
            >
              <div className="p-2 text-center">
                <button
                  className="w-full bg-gray-200 text-black rounded hover:bg-gray-300 p-2 mb-1"
                  onClick={logout}
                >
                  Logout
                </button>
                <Link to={admin ? "/admin/profile" : "/profile"}>
                  <button className="w-full bg-teal-500 text-white rounded hover:bg-teal-600 p-2">
                    Profile
                  </button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Login Button if not logged in */}
      {!user && !admin && (
        <Link
          to={window.location.pathname.includes("/admin") ? "/admin/login" : "/login"}
          className="text-tealish"
        >
          <button
            className="bg-green-500 text-white rounded hover:bg-green-600 px-4 py-2"
            style={{ backgroundColor: "#CA002A" }}
          >
            Login
          </button>
        </Link>
      )}
    </div>
  );
}

export default Navbar;