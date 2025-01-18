import React, { useState } from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "rgb(202,0,42)", // Equivalent to Tailwind's "bg-slate-100"
    borderTop: "1px solid #d1d5db", // Equivalent to "border-t border-gray-300"
    color: "white", // Equivalent to "text-black"
    padding: "16px 0", // Equivalent to "py-4"
    textAlign: "center", // Centers the text
  };

  const containerStyle = {
    maxWidth: "1200px", // Equivalent to "container mx-auto"
    margin: "0 auto",
  };

  const paragraphStyle = {
    marginBottom: "4px", // Equivalent to "mb-2"
  };

  return (
    <footer style={footerStyle} className="bg-[rgb(202,0,42)]">
  <div className="pt-[1rem] text-[14px] text-white">
    <a href="/aboutus" className="mr-[3rem] hover:underline">
      About Us
    </a>
    <a href="/terms" className="mr-[3rem] hover:underline">
      Terms
    </a>
    <a href="/privacy" className="mr-[3rem] hover:underline">
      Privacy Policy
    </a>
    <a href="/faq" className="hover:underline">
      FAQs
    </a>
   
 
      <br></br>
      <br></br>
      <div style={containerStyle}>
        <p style={paragraphStyle} className="text-[10px]">
          &copy; {new Date().getFullYear()} Comment Analyzer. All rights
          reserved
        </p>
      </div>
        {/* Uncomment and style as needed:
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <a href="/privacy-policy" style={{ textDecoration: "underline" }}>
            Privacy Policy
          </a>
          <a href="/terms-of-service" style={{ textDecoration: "underline" }}>
            Terms of Service
          </a>
          <a href="/contact" style={{ textDecoration: "underline" }}>
            Contact Us
          </a>
        </div>
        */}
      </div>
    </footer>
  );
};

export default Footer;
