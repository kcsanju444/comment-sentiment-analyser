import React, { useState } from 'react';

const FAQPage = () => {
  // State to manage active FAQ
  const [activeFAQ, setActiveFAQ] = useState(null);

  // Function to toggle the active FAQ
  const toggleFAQ = (index) => {
    if (activeFAQ === index) {
      setActiveFAQ(null); // Close if the same FAQ is clicked
    } else {
      setActiveFAQ(index); // Open the selected FAQ
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-[rgb(202,0,42)] ml-[19rem]">Frequently Asked Questions (FAQ)</h1>

      {/* FAQ 1 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(0)}
        >
          What is YouTube Comment Analyzer?
        </button>
        {activeFAQ === 0 && (
          <div className="mt-2 px-4 text-gray-700">
            YouTube Comment Analyzer is a tool that allows users to analyze and gain insights from YouTube video comments. It uses sentiment analysis to categorize comments as positive, negative, or neutral.
          </div>
        )}
      </div>

      {/* FAQ 2 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(1)}
        >
          How do I use YouTube Comment Analyzer?
        </button>
        {activeFAQ === 1 && (
          <div className="mt-2 px-4 text-gray-700">
            To use the YouTube Comment Analyzer, simply sign up or log in to your account, input a YouTube video URL, and let the tool analyze the comments. You will receive sentiment data about the comments for better understanding.
          </div>
        )}
      </div>

      {/* FAQ 3 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(2)}
        >
          Do I need to create an account?
        </button>
        {activeFAQ === 2 && (
          <div className="mt-2 px-4 text-gray-700">
            Yes, you need to create an account to access all features of YouTube Comment Analyzer. However, you can explore limited features without signing up.
          </div>
        )}
      </div>

      {/* FAQ 4 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(3)}
        >
          Is my data safe?
        </button>
        {activeFAQ === 3 && (
          <div className="mt-2 px-4 text-gray-700">
            Yes, your data is safe. We adhere to strict privacy policies and never share or sell your personal information. Please read our Privacy Policy for more details.
          </div>
        )}
      </div>

      {/* FAQ 5 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(4)}
        >
          What types of comments can I analyze?
        </button>
        {activeFAQ === 4 && (
          <div className="mt-2 px-4 text-gray-700">
            You can analyze comments from any public YouTube video. The tool will analyze the text of the comments and provide insights based on sentiment.
          </div>
        )}
      </div>

      {/* FAQ 6 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(5)}
        >
          How accurate is the sentiment analysis?
        </button>
        {activeFAQ === 5 && (
          <div className="mt-2 px-4 text-gray-700">
            The sentiment analysis is based on an AI algorithm that processes the comments and categorizes them as positive, negative, or neutral. While the algorithm is fairly accurate, it is not perfect and may occasionally misinterpret some comments.
          </div>
        )}
      </div>

      {/* FAQ 7 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(6)}
        >
          Can I use this tool for videos other than YouTube?
        </button>
        {activeFAQ === 6 && (
          <div className="mt-2 px-4 text-gray-700">
            Currently, YouTube Comment Analyzer only supports YouTube videos. We may expand to other platforms in the future, but for now, we focus on YouTube.
          </div>
        )}
      </div>

      {/* FAQ 8 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(7)}
        >
          How can I contact support?
        </button>
        {activeFAQ === 7 && (
          <div className="mt-2 px-4 text-gray-700">
            If you need help or have any questions, you can contact our support team by emailing [your support email address].
          </div>
        )}
      </div>

      {/* FAQ 9 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(8)}
        >
          Is this tool free to use?
        </button>
        {activeFAQ === 8 && (
          <div className="mt-2 px-4 text-gray-700">
            Yes, YouTube Comment Analyzer is free to use for basic features. However, some advanced features may require a paid subscription.
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQPage;
