import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./../AuthContext";
import Spinner from "./../Component/Spinner";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TwitterAnalyzer = () => {
  const [query, setQuery] = useState("");
  const [positiveTweets, setPositiveTweets] = useState([]);
  const [negativeTweets, setNegativeTweets] = useState([]);
  const [neutralTweets, setNeutralTweets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [sentimentPercentages, setSentimentPercentages] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [allPositive, setAllPositive] = useState([]);
  const [allNegative, setAllNegative] = useState([]);
  const [allNeutral, setAllNeutral] = useState([]);

  const { user, admin } = useAuth();

  const fetchTweets = async () => {
    if (!user && !admin) {
      setError("Please log in first to analyze tweets.");
      return;
    }

    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/tweets", {
        query,
      });
      const fetchedTweets = response.data;

      const totalTweets = fetchedTweets.length;
      const positiveCount = fetchedTweets.filter(
        (tweet) => tweet.sentiment === "positive"
      ).length;
      const negativeCount = fetchedTweets.filter(
        (tweet) => tweet.sentiment === "negative"
      ).length;
      const neutralCount = fetchedTweets.filter(
        (tweet) => tweet.sentiment === "neutral"
      ).length;

      const allPositive = fetchedTweets.filter(
        (tweet) => tweet.sentiment === "positive"
      );
      setAllPositive(allPositive);
      const allNegative = fetchedTweets.filter(
        (tweet) => tweet.sentiment === "negative"
      );
      setAllNegative(allNegative);
      const allNeutral = fetchedTweets.filter(
        (tweet) => tweet.sentiment === "neutral"
      );
      setAllNeutral(allNeutral);

      const newSentimentPercentages = {
        positive: ((positiveCount / totalTweets) * 100).toFixed(2),
        negative: ((negativeCount / totalTweets) * 100).toFixed(2),
        neutral: ((neutralCount / totalTweets) * 100).toFixed(2),
      };

      const positive = fetchedTweets
        .filter((tweet) => tweet.sentiment === "positive")
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, Math.ceil(positiveCount * 0.3));

      const negative = fetchedTweets
        .filter((tweet) => tweet.sentiment === "negative")
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, Math.ceil(negativeCount * 0.3));

      const neutral = fetchedTweets
        .filter((tweet) => tweet.sentiment === "neutral")
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, Math.ceil(neutralCount * 0.3));

      setChartData({
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            label: "Sentiment Distribution",
            data: [positiveCount, negativeCount, neutralCount],
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
          },
        ],
      });

      setPositiveTweets(positive);
      setNegativeTweets(negative);
      setNeutralTweets(neutral);
      setSentimentPercentages(newSentimentPercentages);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Failed to fetch tweets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (tweets, sentiment) => (
    <div id={sentiment.toLowerCase()} className="mb-4 w-4/5 mx-auto">
      <h2 className="text-xl font-bold">{sentiment} Tweets (Top 30%)</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr style={{ backgroundColor: "#CA002A" }}>
            <th className="border px-4 py-2 bg-gray-200">SN</th>
            <th className="border px-4 py-2 bg-gray-200">Tweets</th>
            <th className="border px-4 py-2 bg-gray-200">Confidence (%)</th>
          </tr>
        </thead>
        <tbody>
          {tweets.map((tweet, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{tweet.text}</td>
              <td className="border px-4 py-2">{tweet.confidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleScroll = () => {
    if (window.scrollY > 200) setShowScrollTop(true);
    else setShowScrollTop(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const downloadCSV = () => {
    const csvRows = [];
    csvRows.push(["Sentiment", "Tweet", "Confidence"]);
    const allTweets = [
      ...allPositive.map((tweet) => ({ sentiment: "Positive", ...tweet })),
      ...allNegative.map((tweet) => ({ sentiment: "Negative", ...tweet })),
      ...allNeutral.map((tweet) => ({ sentiment: "Neutral", ...tweet })),
    ];
    allTweets.forEach((tweet) => {
      csvRows.push([tweet.sentiment, tweet.text, tweet.confidence]);
    });

    const csvString = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "tweets_analysis.csv");
    a.click();
  };

  return (
    <div className="p-4 font-sans">
      <div className="mb-4 text-center mt-8">
        <input
          type="text"
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-1/2 mr-2 rounded"
        />
        <button
          onClick={fetchTweets}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading || (!user && !admin)}
        >
          {loading ? "Analysing..." : "Analyse Tweets"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {loading && !error && (
          <div className="flex justify-center mt-8">
            <Spinner />
          </div>
        )}

        {!user && !admin && (
          <p className="text-red-500 mt-2">
            You need to log in as a user or admin to analyze tweets.
          </p>
        )}
      </div>

      {chartData && (
        <div className="flex flex-col md:flex-row justify-center items-start mt-12 mb-8">
          <div className="w-full md:w-1/2 lg:w-1/3 mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-6 text-center">
              Sentiment Distribution
            </h2>
            <Pie
              data={chartData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        const { label } = tooltipItem;
                        const percentage =
                          sentimentPercentages[label.toLowerCase()];
                        return `${label}: ${tooltipItem.raw} (${percentage}%)`;
                      },
                    },
                  },
                },
                onClick: (event, elements) => {
                  if (elements.length > 0) {
                    const segmentIndex = elements[0].index;
                    const label = chartData.labels[segmentIndex];

                    if (label === "Positive") {
                      document.getElementById("positive").scrollIntoView({
                        behavior: "smooth",
                      });
                    } else if (label === "Negative") {
                      document.getElementById("negative").scrollIntoView({
                        behavior: "smooth",
                      });
                    } else if (label === "Neutral") {
                      document.getElementById("neutral").scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }
                },
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-12">
        {renderTable(positiveTweets, "Positive")}
        {renderTable(negativeTweets, "Negative")}
        {renderTable(neutralTweets, "Neutral")}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={downloadCSV}
          className="p-2 bg-blue-500 text-white hover:bg-blue-600"
          disabled={
            loading ||
            (!positiveTweets.length &&
              !negativeTweets.length &&
              !neutralTweets.length)
          }
        >
          Download CSV
        </button>
      </div>

      {showScrollTop && (
        <button
          style={{ backgroundColor: "blue" }}
          onClick={scrollToTop}
          className="fixed bottom-20 left-6 p-3 bg-blue-500 text-white rounded-full shadow-lg transition duration-200"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default TwitterAnalyzer;
