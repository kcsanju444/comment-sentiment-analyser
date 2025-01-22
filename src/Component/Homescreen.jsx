import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../assets/hero.png";
import video from "../assets/vid.mp4";
import meaning from "../assets/meaning.png";
import positive from "../assets/positive.png";
import identify from "../assets/identify.png";
import { Link } from "react-router-dom";

function HomeScreen() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const goToSignup = (e) => {
    e.preventDefault();
    navigate("/signup", { state: { email } });
  };

  const bounceStyle = {
    animation: "bounce 8s ease 2s infinite forwards",
    display: "inline-block",
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      {/* Background Image */}
      <img
        src={homeImage}
        alt="Home Screen"
        className="bg-cover bg-center bg-fixed h-screen w-full m-0"
      />

      {/* Title */}
      <div className="absolute top-[11rem] left-1/3 transform -translate-x-1/2 text-center text-white">
        <h1 className="text-[4rem] font-bold">
          <span style={{ color: "black" }}>Smart</span>
          <span style={{ color: "rgb(202,0,42)", ...bounceStyle }}>Filter</span>
        </h1>
      </div>

      {/* Email Form */}
      <div className="absolute top-[15rem] left-[26rem] transform -translate-x-1/2 mt-10 text-center text-white px-4 items-center">
        <form className="flex items-center space-x-4">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-64 pl-4 pb-[3px] py-2 border-2 border-[#595959] rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={goToSignup}
            className="w-32 px-6 py-2 bg-[rgb(202,0,42)] text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Signup
          </button>
        </form>
      </div>

      {/* Video and Text 50/50 Layout */}
      <div className="flex w-full p-3">
        {/* Video Section */}
        <div className="w-1/2">
          <video
            className="w-[350rem] max-w-[98%] object-cover"
            src={video}
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Text Section */}
        <div className="w-1/2 bg-[rgb(202,0,42)] items-center justify-center text-black p-4">
          <h1 className="text-[2.5rem] ml-[4rem] mt-[8rem] font-bold text-white">
            <span>Analyze comments with</span>
            <br />
            <span>a single click!</span>
            <br />
          </h1>
          <button
            onClick={goToSignup}
            className="w-64 px-8 py-3 mt-[2rem] ml-[4rem] bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Enjoy SmartFilter Now
          </button>
        </div>
      </div>

      {/* Empower Section */}
      <div className="mt-[1.5rem] font-bold text-[2rem]">
        <span>
          We empower you to <span className="text-[rgb(202,0,42)]">analyze</span>,{" "}
          <span className="text-[rgb(202,0,42)]">filter</span>,
        </span>
        <br />
        <span className="ml-[2.5rem]">
          and <span className="text-[rgb(202,0,42)]">protect</span> your comments..
        </span>
      </div>

      <div className="font-light">
        <br />
        <span>
          Clarityze is the easiest way to analyze comments and detect spam,
        </span>
        <br />
        <span className="ml-[2.5rem]">
          helping you measure engagement and uncover trends.
        </span>
      </div>

      {/* Call to Action */}
      <div className="w-1/3 bg-[rgb(202,0,42)] mt-[2rem] items-center justify-center text-white p-4">
        <Link
          to="/commentanalyzer"
          className="font-bold mt-[3.5rem] text-black hover:text-white transition duration-300"
        >
          YOUTUBE
        </Link>
        <br />
        <span className="font-light">
        Clarityze is a tool for analyzing Twitter comments, helping you understand sentiment, track engagement, and uncover trends
        </span>
        <br />
        <br />
        <Link
          to="/twitteranalyer"
          className="font-bold mt-[3.5rem] text-black hover:text-white transition duration-300"
        >
          TWITTER
        </Link>
        <br />
        <span className="font-light">
          Clarityze is a tool for analyzing YouTube comments, helping you
          understand sentiment, track engagement, and uncover trends.
        </span>
        <br />
        <br />
        <Link
          to="/spamdetection"
          className="font-bold mt-[3.5rem] text-black hover:text-white transition duration-300"
        >
          SPAM DETECTION
        </Link>
        <br />
        <span className="font-light">
        Clarityze is a tool for detecting spam in comments, helping you maintain clean and engaging conversations across platforms.
        </span>
      </div>

      {/* Why TubeSentiment Section */}
      <div className="mt-[2rem]">
        <span className="ml-[0rem] mt-[5rem] font-bold text-[2rem]">
          Why SmartFilter?

        </span>
      </div>

      <div className="flex space-[1rem] mr-[10rem]">
        <img
          src={meaning}
          alt="meaning"
          className="h-[9rem] w-auto ml-[6rem]"
        />
        <span className="mt-[3.5rem] text-medium">
          Engage in meaningful
          <br />
          conversations
        </span>
        <img
          src={identify}
          alt="meaning"
          className="h-[8rem] w-auto mt-[0.5rem] ml-[2rem]"
        />
        <span className="mt-[3.5rem] text-medium">
         Filter spam to boost
          <br />
           engagement
        </span>
        <img
          src={positive}
          alt="meaning"
          className="h-[8rem] w-auto mt-[0.5rem] ml-[2.5rem]"
        />
        <span className="mt-[3.5rem] text-medium">
          Monitor and manage your
          <br />
          online reputation
        </span>
      </div>

      {/* Inline Keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            25% {
              transform: translateY(-30px);
            }
            50% {
              transform: translateY(15px);
            }
            75% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </div>
  );
}

export default HomeScreen;
