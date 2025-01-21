import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./../AuthContext";
import Spinner from "./../Component/Spinner";

const TwitterAnalyzer = () => {
  const [query, setQuery] = useState("");
  const [tweet, setTweet] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, admin } = useAuth();

  const fetchTweetSentiment = async () => {
    if (!user && !admin) {
      setError("Please log in first to analyze tweets.");
      return;
    }

    if (!query.trim()) {
      setError("Please enter a valid tweet URL or text.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/tweets", {
        query,
      });
      const data = response.data;

      setTweet(data.tweet);
      setSentiment(data.sentiment);
      setConfidence(data.confidence);
    } catch (err) {
      console.error("Error analyzing tweet:", err);
      setError("Failed to analyze the tweet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 font-sans">
      <div className="mb-4 text-center mt-8">
        <input
          type="text"
          placeholder="Enter tweet URL or text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-1/2 mr-2 rounded"
        />
        <button
          onClick={fetchTweetSentiment}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || (!user && !admin)}
        >
          {loading ? "Analyzing..." : "Analyze Tweet"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {loading && !error && (
        <div className="flex justify-center mt-8">
          <Spinner />
        </div>
      )}

      {tweet && sentiment && confidence !== null && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold">Tweet Analysis</h2>
          <p className="mt-4 text-gray-700">
            <strong>Tweet:</strong> {tweet}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Sentiment:</strong> {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </p>
          <p className="mt-2 text-gray-700">
            <strong>Confidence:</strong> {confidence}%
          </p>
        </div>
      )}
    </div>
  );
};

export default TwitterAnalyzer;
