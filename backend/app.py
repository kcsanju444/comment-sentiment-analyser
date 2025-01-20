from flask import Flask, request, jsonify
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
from dotenv import load_dotenv

load_dotenv()

youtube_API_key = os.getenv('YOUTUBE_API_KEY')
twitter_API_key = os.getenv('TWITTER_API_KEY')

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

# Preprocess function to clean text
def preprocess_text(text):
    text = text.lower()  # Lowercase the text
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])  # Remove stopwords & lemmatize
    return text

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

def fetch_twitter_data(query, api_key):
    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    url = "https://api.twitter.com/2/tweets/search/recent"
    params = {
        "query": query,  # The search query
        "tweet.fields": "text",  # Specify that we only want the tweet text
        "max_results": 100  # Maximum number of tweets to fetch per request
    }

    tweets = []
    next_token = None

    while True:
        if next_token:
            params["next_token"] = next_token

        # Fetch tweets using the API
        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            raise Exception(f"Twitter API error: {response.status_code} {response.text}")

        data = response.json()

        # Append the tweets
        for tweet in data.get("data", []):
            tweets.append(tweet["text"])

        # Check if there are more tweets to fetch
        next_token = data.get("meta", {}).get("next_token")
        if not next_token:
            break

    return tweets

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
    
@app.route('/api/tweets', methods=['POST'])
def analyze_tweets():
    try:
        # Get the request data from frontend
        data = request.json
        tweet_query = data.get('query')
        if not tweet_query:
            return jsonify({"error": "No query provided"}), 400

        api_key = twitter_API_key  # Replace with your Twitter API Bearer Token

        # Fetch tweets using Twitter API
        tweets = fetch_twitter_data(tweet_query, api_key)
        if not tweets:
            return jsonify({"error": "No tweets found"}), 404

        # Preprocess the tweets
        cleaned_tweets = [preprocess_text(tweet) for tweet in tweets]

        # Convert the cleaned tweets into a DataFrame for analysis
        df = pd.DataFrame(cleaned_tweets, columns=['Cleaned_Tweet'])

        # Analyze the tweets using the pre-trained model and get probabilities
        probabilities = model_pipeline.predict_proba(df['Cleaned_Tweet'])

        # Process the probabilities to return the sentiment with the highest confidence
        results = []
        for i, tweet in enumerate(tweets):
            prob = probabilities[i]
            max_prob = max(prob)
            sentiment = "positive" if prob[2] == max_prob else "neutral" if prob[1] == max_prob else "negative"
            results.append({
                "tweet": tweet,
                "sentiment": sentiment,
                "confidence": round(max_prob * 100, 2)  # Return percentage confidence
            })

        # Return the result as JSON
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Custom error handler for 404 errors
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
