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
          What is SmartFilter?
        </button>
        {activeFAQ === 0 && (
          <div className="mt-2 px-4 text-gray-700">
            SmartFilter is an advanced tool designed to analyze and extract valuable insights from social media interactions. By leveraging sentiment analysis, SmartFilter categorizes comments and messages from platforms like YouTube and Twitter into positive, negative, or neutral, helping businesses and individuals make data-driven decisions.
          </div>
        )}
      </div>

      {/* FAQ 2 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(1)}
        >
          How does SmartFilter work?
        </button>
        {activeFAQ === 1 && (
          <div className="mt-2 px-4 text-gray-700">
            SmartFilter uses AI-powered sentiment analysis to scan and categorize the vast volume of comments, reactions, and messages across platforms like YouTube and Twitter. It processes the text data and classifies it based on sentiment, offering insights into public perception and trends.
          </div>
        )}
      </div>

      {/* FAQ 3 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(2)}
        >
          What platforms does SmartFilter support?
        </button>
        {activeFAQ === 2 && (
          <div className="mt-2 px-4 text-gray-700">
            Currently, SmartFilter supports YouTube and Twitter. We are working to expand the platform compatibility in the future.
          </div>
        )}
      </div>

      {/* FAQ 4 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(3)}
        >
          Do I need an account to use SmartFilter?
        </button>
        {activeFAQ === 3 && (
          <div className="mt-2 px-4 text-gray-700">
            Yes, to access all of SmartFilter's features, you need to create an account. This helps us provide a personalized experience and securely store your analysis results.
          </div>
        )}
      </div>

      {/* FAQ 5 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(4)}
        >
          How can I analyze comments from a specific video or post?
        </button>
        {activeFAQ === 4 && (
          <div className="mt-2 px-4 text-gray-700">
            Simply log in to your account, input the URL of the YouTube video or Twitter post you wish to analyze, and SmartFilter will process the comments for sentiment analysis.
          </div>
        )}
      </div>

      {/* FAQ 6 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(5)}
        >
          How accurate is SmartFilter's sentiment analysis?
        </button>
        {activeFAQ === 5 && (
          <div className="mt-2 px-4 text-gray-700">
            SmartFilter's sentiment analysis is powered by AI algorithms that provide highly accurate sentiment categorizations. While it is generally reliable, the AI may occasionally misinterpret certain comments, especially if they contain sarcasm or complex expressions.
          </div>
        )}
      </div>

      {/* FAQ 7 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(6)}
        >
          Can I use SmartFilter for other social media platforms?
        </button>
        {activeFAQ === 6 && (
          <div className="mt-2 px-4 text-gray-700">
            At the moment, SmartFilter is designed specifically for YouTube and Twitter. However, we plan to integrate more platforms in the future to provide a broader analysis scope.
          </div>
        )}
      </div>

      {/* FAQ 8 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(7)}
        >
          How can SmartFilter help businesses and individuals?
        </button>
        {activeFAQ === 7 && (
          <div className="mt-2 px-4 text-gray-700">
            SmartFilter provides valuable insights into public sentiment, enabling businesses to track brand perception, evaluate audience reactions, and optimize their marketing strategies. Individuals can use it to gauge the overall mood around a particular topic or trend.
          </div>
        )}
      </div>

      {/* FAQ 9 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(8)}
        >
          Is SmartFilter free to use?
        </button>
        {activeFAQ === 8 && (
          <div className="mt-2 px-4 text-gray-700">
            SmartFilter offers both free and paid versions. The free version provides access to basic sentiment analysis features, while the paid version unlocks advanced functionalities like detailed analytics and multi-platform support.
          </div>
        )}
      </div>

      {/* FAQ 10 */}
      <div className="mb-4">
        <button
          className="w-full text-left text-xl font-semibold py-2 px-4 bg-gray-200 rounded-lg focus:outline-none"
          onClick={() => toggleFAQ(9)}
        >
          How can I contact SmartFilter support?
        </button>
        {activeFAQ === 9 && (
          <div className="mt-2 px-4 text-gray-700">
            If you have any issues or questions, you can reach out to our support team by emailing [support email address] or using the contact form on our website.
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQPage;
