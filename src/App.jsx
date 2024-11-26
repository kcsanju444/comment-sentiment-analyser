import React, { useState } from "react";
import Navbar from "./Navbar/Navbar";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import Footer from "./Component/Footer";
import CommentAnalyzer from "./CommentAnalyzer/CommentAnalyzer";
import Profile from "./Component/Profile";
import AdminLogin from "./Admin/AdminLogin";
import AdminSignup from "./Admin/AdminSignup";
import AdminProfile from "./Admin/AdminProfile";

function App() {
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <div className="App flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<CommentAnalyzer />} />
          <Route path="/admin/" element={<CommentAnalyzer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
