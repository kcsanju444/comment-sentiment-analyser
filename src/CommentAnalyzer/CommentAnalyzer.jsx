import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./../AuthContext"; // Import the Auth context hook
import Spinner from "./../Component/Spinner"; // Import the Spinner component
import { Pie } from "react-chartjs-2"; // Pie chart component
import { Chart, registerables } from "chart.js"; // Import Chart and registerables from Chart.js

// Register the required components for Chart.js
Chart.register(...registerables);

const CommentAnalyzer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [positiveComments, setPositiveComments] = useState([]);
  const [negativeComments, setNegativeComments] = useState([]);
  const [neutralComments, setNeutralComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null); // For pie chart
  const [sentimentPercentages, setSentimentPercentages] = useState({}); // Store percentages
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [allPositive, setAllPositive] = useState([]);
  const [allNegative, setAllNegative] = useState([]);
  const [allNeutral, setAllNeutral] = useState([]);

  const { user, admin } = useAuth(); // Use the Auth context

  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|watch\?[^v]+v=)?([^\s&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchComments = async () => {
    if (!user && !admin) {
      setError("Please log in first to analyze comments.");
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError("Invalid YouTube URL. Please enter a valid URL.");
      return;
    }

    setError(null);
    setLoading(true);
    // const startTime = performance.now();

    try {
      const response = await axios.post("http://localhost:5000/api/comments", {
        video_url: videoUrl,
      });
      const fetchedComments = response.data;

      // const endTime = performance.now();
      // const timeTaken = (endTime - startTime) / 1000; // Convert milliseconds to seconds

      // console.log(
      //   Time taken to fetch and analyze comments: ${timeTaken.toFixed(
      //     2
      //   )} seconds
      // );

      // // You can also display this time in the UI, for example:
      // setError(Time taken: ${timeTaken.toFixed(2)} seconds);

      // Calculate total counts of sentiments
      const totalComments = fetchedComments.length;
      const positiveCount = fetchedComments.filter(
        (comment) => comment.sentiment === "positive"
      ).length;
      const negativeCount = fetchedComments.filter(
        (comment) => comment.sentiment === "negative"
      ).length;
      const neutralCount = fetchedComments.filter(
        (comment) => comment.sentiment === "neutral"
      ).length;

      const allPositive = fetchedComments.filter(
        (comment) => comment.sentiment === "positive"
      ); // Top 30% of positive comments
      setAllPositive(allPositive);
      const allNegative = fetchedComments.filter(
        (comment) => comment.sentiment === "negative"
      ); // Top 30% of negative comments
      setAllNegative(allNegative);

      const allNeutral = fetchedComments.filter(
        (comment) => comment.sentiment === "neutral"
      ); // Top 30% of neutral comments
      setAllNeutral(allNeutral);

      // Calculate sentiment percentages for the pie chart
      const newSentimentPercentages = {
        positive: ((positiveCount / totalComments) * 100).toFixed(2),
        negative: ((negativeCount / totalComments) * 100).toFixed(2),
        neutral: ((neutralCount / totalComments) * 100).toFixed(2),
      };

      // Sort comments by confidence and filter the top 30% for each sentiment
      const positive = fetchedComments
        .filter((comment) => comment.sentiment === "positive")
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, Math.ceil(positiveCount * 0.3)); // Top 30% of positive comments

      const negative = fetchedComments
        .filter((comment) => comment.sentiment === "negative")
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, Math.ceil(negativeCount * 0.3)); // Top 30% of negative comments

      const neutral = fetchedComments
        .filter((comment) => comment.sentiment === "neutral")
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, Math.ceil(neutralCount * 0.3)); // Top 30% of neutral comments

      // Set state for chart data
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

      // Set state for comments and percentages
      setPositiveComments(positive);
      setNegativeComments(negative);
      setNeutralComments(neutral);
      setSentimentPercentages(newSentimentPercentages); // Set percentages
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (comments, sentiment) => (
    <div id={sentiment.toLowerCase()} className="mb-4 w-4/5 mx-auto">
      <h2 className="text-xl font-bold">{sentiment} Comments (Top 30%)</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
        <tr style={{ backgroundColor: '#CA002A' }}>
          
            <th className="border px-4 py-2 bg-gray-200">SN</th>
            <th className="border px-4 py-2 bg-gray-200">Comments</th>
            <th className="border px-4 py-2 bg-gray-200">Confidence (%)</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{comment.comment}</td>
              <td className="border px-4 py-2">{comment.confidence}</td>
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
    // Headers
    csvRows.push(["Sentiment", "Comment", "Confidence"]);
    // Combine all comments
    const allComments = [
      ...allPositive.map((comment) => ({
        sentiment: "Positive",
        ...comment,
      })),
      ...allNegative.map((comment) => ({
        sentiment: "Negative",
        ...comment,
      })),
      ...allNeutral.map((comment) => ({
        sentiment: "Neutral",
        ...comment,
      })),
    ];
    allComments.forEach((comment) => {
      csvRows.push([comment.sentiment, comment.comment, comment.confidence]);
    });

    const csvString = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "comments_analysis.csv");
    a.click();
  };

  return (
    <div className="p-4 font-sans">
      <div className="mb-4 text-center mt-8">
        <input
          type="text"
          placeholder="Paste YouTube video URL here"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="border p-2 w-1/2 mr-2 rounded"
        />
        <button
          onClick={fetchComments}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading || (!user && !admin)}
        >
          {loading ? "Analysing..." : "Analyse Comments"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {loading && !error && (
          <div className="flex justify-center mt-8">
            <Spinner />
          </div>
        )}

        {!user && !admin && (
          <p className="text-red-500 mt-2">
            You need to log in as a user or admin to analyze comments.
          </p>
        )}
      </div>

      {/* Render pie chart */}
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
                    // Get the clicked segment
                    const segmentIndex = elements[0].index;
                    const label = chartData.labels[segmentIndex];

                    // Scroll to the respective section
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
        {renderTable(positiveComments, "Positive")}
        {renderTable(negativeComments, "Negative")}
        {renderTable(neutralComments, "Neutral")}
      </div>
      <div className=" mt-12  flex justify-center">
        <button
          onClick={downloadCSV}
          className="p-2 bg-green-500 text-white  hover:bg-green-600"
          disabled={
            loading ||
            (!positiveComments.length &&
              !negativeComments.length &&
              !neutralComments.length)
          }
        >
          Download CSV
        </button>
      </div>
      {showScrollTop && (
        <button
        style={{backgroundColor:"red"}}
          onClick= {scrollToTop}
          className="fixed bottom-20 left-6 p-3 bg-green-500 text-white  hover:bg-green-600  rounded-full shadow-lg  transition duration-200"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default CommentAnalyzer;
