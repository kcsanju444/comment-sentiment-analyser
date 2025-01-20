import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./../AuthContext";
import Spinner from "./../Component/Spinner";

const SpamDetector = () => {
  const [message, setMessage] = useState("");
  const [classification, setClassification] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, admin } = useAuth();

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

  return (
    <div className="p-4 font-sans">
      <div className="mb-4 text-center mt-8">
        {/* Display login message when user/admin is not logged in */}
        {!user && !admin && <p className="text-red-500 mt-2">Please log in to classify messages.</p>}

        <textarea
          placeholder="Enter your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-1/2 mr-2 rounded"
          rows="4"
          disabled={loading} // Disable textarea during loading
        />
        
        <button
          onClick={classifyMessage}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || (!user && !admin)} // Disable button if loading or user isn't logged in
        >
          {loading ? "Classifying..." : "Classify Message"}
        </button>
        
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
    </div>
  );
};

export default SpamDetector;
