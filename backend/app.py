from flask import Flask, request, jsonify
import re
import googleapiclient.discovery
import re
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import pandas as pd
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from auth import auth  # Import the auth blueprint
from models import db  # Import db from models.py
import os
import requests
import logging
from dotenv import load_dotenv

load_dotenv()

youtube_API_key = os.getenv('YOUTUBE_API_KEY')
twitter_API_key = os.getenv('TWITTER_API_KEY')

if not youtube_API_key or not twitter_API_key:
    raise ValueError("API keys not found. Make sure your .env file contains YOUTUBE_API_KEY and TWITTER_API_KEY")

# Initialize Flask app and allow CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# App configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:12345@localhost/comment-analyser'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the app
db.init_app(app)

# Register the auth blueprint
app.register_blueprint(auth)

# Load the trained sentiment analysis model
model_pipeline = joblib.load('sentiment_model.pkl')

# Pre-download NLTK resources if not already available
nltk_data_dir = os.path.expanduser('~') + '/nltk_data'
if not os.path.exists(nltk_data_dir):
    nltk.download('stopwords')
    nltk.download('wordnet')

# Load stopwords and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Fetch comments from YouTube using the YouTube Data API
def fetch_youtube_comments(video_id, api_key):
    youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=api_key)

    comments = []
    next_page_token = None

    while True:
        # Fetch comments using the API
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100,
            pageToken=next_page_token
        )
        response = request.execute()

        # Append the comments
        for item in response["items"]:
            comment = item["snippet"]["topLevelComment"]["snippet"]["textOriginal"]
            comments.append(comment)

        # Check if there are more comments to fetch
        next_page_token = response.get("nextPageToken")
        if not next_page_token:
            break

    return comments

# Route for base URL
@app.route('/')
def index():
    return "API for YouTube Comment Analysis is running."

# Route for receiving the video URL and processing the comments
@app.route('/api/comments', methods=['POST'])
def analyze_comments():
    try:
        # Get the request data from frontend
        data = request.json
        video_url = data.get('video_url')
        if not video_url:
            return jsonify({"error": "No video URL provided"}), 400

        api_key = youtube_API_key  # Replace with your API key

        # Extract video ID from YouTube URL
        video_id = video_url.split("v=")[-1]

        # Fetch comments using YouTube Data API
        comments = fetch_youtube_comments(video_id, api_key)
        if not comments:
            return jsonify({"error": "No comments found"}), 404

        # Preprocess the comments
        cleaned_comments = [preprocess_text(comment) for comment in comments]

        # Convert the cleaned comments into a DataFrame for analysis
        df = pd.DataFrame(cleaned_comments, columns=['Cleaned_Comment'])

        # Analyze the comments using the pre-trained model and get probabilities
        probabilities = model_pipeline.predict_proba(df['Cleaned_Comment'])

        # Process the probabilities to return the sentiment with the highest confidence
        results = []
        for i, comment in enumerate(comments):
            prob = probabilities[i]
            max_prob = max(prob)
            sentiment = "positive" if prob[2] == max_prob else "neutral" if prob[1] == max_prob else "negative"
            results.append({
                "comment": comment,
                "sentiment": sentiment,
                "confidence": round(max_prob * 100, 2)  # Return percentage confidence
            })

        # Return the result as JSON
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
from datetime import datetime

def fetch_twitter_data(query, api_key, max_results=10, max_retries=5):
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    url = "https://api.twitter.com/2/tweets/search/recent"
    params = {
        "query": query,
        "tweet.fields": "text",
        "max_results": max_results
    }

    tweets = []
    next_token = None

    for attempt in range(max_retries):
        if next_token:
            params["next_token"] = next_token

        response = requests.get(url, headers=headers, params=params)
        print(f"Attempt {attempt + 1}: Response status code {response.status_code}")

        if response.status_code == 200:
            data = response.json()

            # Append tweets to the list
            for tweet in data.get("data", []):
                tweets.append(tweet["text"])

            next_token = data.get("meta", {}).get("next_token")
            if not next_token:
                break

        elif response.status_code == 429:  # Rate limit exceeded
            retry_after = int(response.headers.get("x-rate-limit-reset", 60))  # Default to 60 seconds
            print(f"Rate limit reached. Retrying after {retry_after} seconds...")
            time.sleep(retry_after)

        else:
            print(f"Error Response: {response.status_code} {response.text}")
            raise Exception(f"Twitter API error: {response.status_code} {response.text}")

    if not tweets and response.status_code == 429:
        print("Rate limit exceeded multiple times. Please try later.")
        raise Exception("Rate limit exceeded. Please try again later.")

    return tweets
    
def get_tweet_id(tweet_url):
    match = re.search(r"status/(\d+)", tweet_url)
    if match:
        return match.group(1)
    return None

import time

def fetch_tweet_by_id(tweet_id, api_key, max_retries=5):
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    url = f"https://api.twitter.com/2/tweets/{tweet_id}"
    params = {
        "tweet.fields": "text"
    }

    for attempt in range(max_retries):
        response = requests.get(url, headers=headers, params=params)
        print(f"Response Status: {response.status_code}, Attempt: {attempt + 1}")
        
        if response.status_code == 200:
            data = response.json()
            return data.get("data", {}).get("text", None)

        elif response.status_code == 429:
            retry_after = int(response.headers.get("x-rate-limit-reset", 60))  # Fallback to 60 seconds if not provided
            print(f"Rate limit reached. Retrying after {retry_after} seconds...")
            time.sleep(retry_after)

        else:
            print(f"Error Response: {response.text}")
            raise Exception(f"Twitter API error: {response.status_code} {response.text}")

    raise Exception("Exceeded maximum retries due to rate limiting.")

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/tweets', methods=['POST'])
def analyze_tweets():
    try:
        data = request.json
        query = data.get('query')

        if not query:
            return jsonify({"error": "No query provided"}), 400

        tweets = fetch_twitter_data(query, twitter_API_key)

        if not tweets:
            return jsonify({"error": "No tweets found"}), 404

        # Preprocess and analyze tweets
        cleaned_tweets = [preprocess_text(tweet) for tweet in tweets]
        probabilities = model_pipeline.predict_proba(cleaned_tweets)

        results = []
        for i, tweet in enumerate(tweets):
            prob = probabilities[i]
            max_prob = max(prob)
            sentiment = "positive" if prob[2] == max_prob else "neutral" if prob[1] == max_prob else "negative"
            results.append({
                "tweet": tweet,
                "sentiment": sentiment,
                "confidence": round(max_prob * 100, 2)
            })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Custom error handler for 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

# Load the spam detection model (assuming it is saved as 'spam_model.pkl')
spam_model = joblib.load('spam_model.pkl')

nltk_data_dir = os.path.expanduser('~') + '/nltk_data'
if not os.path.exists(nltk_data_dir):
    nltk.download('stopwords')
    nltk.download('wordnet')

# Load stopwords and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Preprocess function to clean the text
def preprocess_text(text):
    text = text.lower()  # Lowercase the text
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])  # Remove stopwords & lemmatize
    return text

# Load the pre-trained vectorizer (assumes it was saved alongside the model)
vectorizer = joblib.load('vectorizer.pkl')

# Route for spam detection
@app.route('/api/spam', methods=['POST'])
def detect_spam():
    try:
        data = request.json
        message = data.get('message')
        if not message:
            return jsonify({"error": "No message provided"}), 400

        # Preprocess the message
        cleaned_message = preprocess_text(message)

        # Transform the text into numeric form using the vectorizer
        transformed_message = vectorizer.transform([cleaned_message])  # Returns a sparse matrix

        # Predict spam or non-spam
        prediction = spam_model.predict(transformed_message)
        prediction_prob = spam_model.predict_proba(transformed_message)

        # Assuming 0 is non-spam, 1 is spam
        is_spam = bool(prediction[0] == 1)  # Explicitly cast to Python bool
        confidence = float(max(prediction_prob[0]))  # Cast confidence to Python float

        return jsonify({
            "isSpam": is_spam,
            "confidence": confidence
        })

    except Exception as e:
        print(f"Error: {str(e)}")  # Log the error for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)