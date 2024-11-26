import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-slate-100 border-t border-gray-300 text-black py-4 ">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Comment Analyzer. All rights
          reserved
        </p>
        {/* <div className="flex justify-center space-x-4">
          <a href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline">
            Terms of Service
          </a>
          <a href="/contact" className="hover:underline">
            Contact Us
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
