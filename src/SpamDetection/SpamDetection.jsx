import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./../AuthContext";
import Spinner from "./../Component/Spinner";
import spam from "../assets/spam.jpg";
import image from "../assets/image.png";

import spamvid from "../assets/spam.mp4";
import { useNavigate } from "react-router-dom"; // Ensure useNavigate is imported

const SpamDetector = () => {
  const [message, setMessage] = useState("");
  const [classification, setClassification] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // Add email state

  const { user, admin } = useAuth();
  const navigate = useNavigate();

  const classifyMessage = async () => {
    if (!user && !admin) {
      setError("Please log in first to detect spam.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a valid message.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/spam", { message });
      const { isSpam, confidence } = response.data;

      setClassification({
        result: isSpam ? "Spam" : "Non-Spam",
        confidence: (confidence * 100).toFixed(2), // Multiply by 100 to show percentage
      });

      setError(null);
    } catch (error) {
      console.error("Error classifying message:", error);
      setError("An error occurred while classifying the message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = (e) => {
    
    navigate("/signup", { state: { email } });
  };

  return (
    <div className="p-4 font-sans">
      {!user && !admin && <p className="text-red-500 text-center mt-2">Please log in to classify messages.</p>}

      <div className="mb-4 text-center mt-8">
        <div className="flex">
          <div>
            <img
              src={spam}
              alt="login"
              className="w-[30rem] mt-[2.5rem] ml-[5rem] h-[15rem] max-w-[98%] object-cover rounded shadow-md"
            />
            <span className="font-bold text-[3rem]">Spam Detection &</span>
            <br />
            <span className="font-bold mr-[14rem] text-[3rem]">Filtering</span>
          </div>

          <div>
            <textarea
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-black p-2 w-[30rem] mt-[2.5rem] ml-[3rem] h-[12rem] mr-2 rounded"
              rows="4"
              disabled={loading} // Disable textarea during loading
            />
            <br />
            <br />
            <button
              onClick={classifyMessage}
              className="flex items-center justify-center bg-[rgb(202,0,42)] text-white rounded px-6 py-3 hover:bg-green-500 transition-all ml-[3rem]"
              disabled={loading || (!user && !admin)} // Disable button if loading or user isn't logged in
            >
              {loading ? "Classifying..." : "Classify Message"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {loading && !error && (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )}

      {classification && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold">
            Classification Result: {classification.result}
          </h2>
          <p>Confidence: {classification.confidence}%</p>
        </div>
      )}

      <div className="flex bg-[rgb(202,0,42)] h-[30rem] w-full">
        <div className="mt-[2rem]">
          <span className="font-bold ml-[2rem] text-white text-[2rem]">What is the process of </span>
          <br />
          <span className="font-bold text-white ml-[2rem] text-[2rem]">spam detection?</span>
          <br />
          <br />
          <span className="font-bold ml-[2rem] text-white text-[1.5rem]">1. Input the Comment</span>
          <br />
          <span className="ml-[3.6rem] text-white">Enter the spam comment into the designated input box.</span>
          <br />
          <br />
          <span className="font-bold ml-[2rem] text-white text-[1.5rem]">2. Click on "Classify Message"</span>
          <br />
          <span className="ml-[3.6rem] text-white">After entering the comment, click the "Classify Message"</span>
          <br />
          <span className="ml-[3.6rem] text-white">button to initiate the detection process..</span>
          <br />
          <br />
          <span className="font-bold ml-[2rem] text-white text-[1.5rem]">3. Classify and Display Result</span>
          <br />
          <span className="ml-[3.6rem] text-white">The system processes the input comment, analyzes it using the</span>
          <br />
          <span className="ml-[3.6rem] text-white">trained model, and displays whether the comment is spam or not.</span>
        </div>

        <div className="mt-[3rem]">
          <button
            onClick={goToSignup}
            className="w-64 px-8 py-3  ml-[22rem] bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
Get Started Now          </button>
          <video
            className="w-[35rem] max-w-[98%] mt-[4rem] ml-[3rem] object-cover"
            src={spamvid}
            autoPlay
            loop
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="flex">

      <div className="ml-[2rem] mb-[4rem]">
        <img src={image} alt="img"  className="w-[20rem] ml-[15rem]"/>
      </div>
      <div className="flex flex-col mt-[5rem] ml-[2rem] items-center">
  <span className="font-bold text-[2rem]">Analyzing Comments,</span>
  <span className="font-bold text-[2rem] mr-[5rem]">Enhancing Trust.</span>
<span className="mr-[1.8rem]" >Analyzing YouTube and Twitter comments </span>
<span className="mr-[3.7rem]">to improve engagement and enhance </span>
<span className="mr-[11rem]">online conversations.</span>
<a href="/commentanalyzer" className="text-[rgb(202,0,42)] underline mr-[12rem]">YouTube Analyzer</a>
<a href="/twitteranalyer" className="text-[rgb(202,0,42)] underline mr-[13rem]">Twitter Analyzer</a>
</div>

      </div>
    </div>
  );
};

export default SpamDetector;
