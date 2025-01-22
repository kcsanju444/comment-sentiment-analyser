import re
import googleapiclient.discovery
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import pandas as pd
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify
from auth import auth  # Import the auth blueprint
from models import db  # Import db from models.py
import os
import requests
import logging
from dotenv import load_dotenv
from datetime import datetime
import time

# Toggle between mock mode and live API mode for testing and debugging
USE_MOCK_DATA = False

load_dotenv()

youtube_API_key = os.getenv('YOUTUBE_API_KEY')
twitter_bearer_token = os.getenv('TWITTER_BEARER_TOKEN')

if not youtube_API_key or not twitter_bearer_token:
    raise ValueError("API keys not found. Make sure your .env file contains YOUTUBE_API_KEY and TWITTER_API_KEY")

# Initialize Flask app and allow CORS
app = Flask(__name__)
CORS(app)  # Allow all origins

# App configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:12345@localhost/CommentAnalyzer'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the app
db.init_app(app)

# Register the auth blueprint
app.register_blueprint(auth)

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler("app.log")]
)

# Load environment variables
twitter_bearer_token = os.getenv('TWITTER_BEARER_TOKEN')

if not twitter_bearer_token:
    logging.error("Twitter API key not found. Make sure your .env file contains TWITTER_BEARER_TOKEN.")
    raise ValueError("Twitter API key not found.")

# Load the trained sentiment analysis model
try:
    model_pipeline = joblib.load('sentiment_model.pkl')
    logging.info("Sentiment model loaded successfully.")
except FileNotFoundError:
    logging.error("Sentiment model file not found. Ensure 'sentiment_model.pkl' is in the correct path.")
    raise Exception("Sentiment model file not found.")

# Pre-download NLTK resources
nltk_data_dir = os.path.expanduser('~') + '/nltk_data'
if not os.path.exists(nltk_data_dir):
    os.makedirs(nltk_data_dir, exist_ok=True)
    nltk.download('stopwords', download_dir=nltk_data_dir)
    nltk.download('wordnet', download_dir=nltk_data_dir)

nltk.data.path.append(nltk_data_dir)

# Load stopwords and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Preprocess function to clean the text
def preprocess_text(text):
    if not text:
        return ""
    try:
        text = text.lower()  # Lowercase the text
        text = re.sub(r'\d+', '', text)  # Remove numbers
        text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
        text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])  # Remove stopwords & lemmatize
        return text
    except Exception as e:
        logging.error(f"Error during text preprocessing: {e}")
        return ""


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

# Load stopwords and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Cache for storing fetched tweets to reduce API calls
tweet_cache = {}

# Extract the tweet ID from a URL
def extract_tweet_id(url):
    match = re.search(r"status/(\d+)", url)
    return match.group(1) if match else None

# Mock tweet data for testing
mock_tweet_data = {
    "1453489038376132610": "Just watched an incredible sunset over the mountains! #blessed",
    "1453489123947812874": "Excited for the big game tonight. Let’s go, team! 🏈 #GameDay",
    "1453489231094845442": "Looking for book recommendations—what’s everyone reading these days? 📚",
}

# Fetch a single tweet by ID with rate limit handling and caching
def fetch_tweet_by_id(tweet_id, api_key):
    if USE_MOCK_DATA:
        # Mock data logic
        if tweet_id in mock_tweet_data:
            logging.info(f"Using mock data for tweet ID: {tweet_id}")
            return mock_tweet_data[tweet_id]
        logging.warning(f"Tweet ID {tweet_id} not found in mock data.")
        return None
    else:
        # Cache and API call logic
        if tweet_id in tweet_cache:
            logging.info(f"Tweet found in cache: {tweet_id}")
            return tweet_cache[tweet_id]

        headers = {"Authorization": f"Bearer {api_key}"}
        url = f"https://api.twitter.com/2/tweets/{tweet_id}"

        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                tweet_text = data.get("data", {}).get("text")
                tweet_cache[tweet_id] = tweet_text
                return tweet_text
            elif response.status_code == 429:
                retry_after = int(response.headers.get("x-rate-limit-reset", time.time() + 60)) - int(time.time())
                logging.warning(f"Rate limit exceeded. Retrying after {retry_after} seconds.")
                time.sleep(max(retry_after, 1))
            else:
                logging.error(f"Failed to fetch tweet by ID {tweet_id}. Status code: {response.status_code}")
        except Exception as e:
            logging.error(f"Error fetching tweet by ID {tweet_id}: {e}")
        return None


# Route to analyze a single tweet
@app.route('/api/tweets', methods=['POST'])
def analyze_tweet():
    try:
        data = request.json
        query = data.get('query')

        if not query:
            logging.error("Query validation failed: No query provided in the request.")
            return jsonify({"error": "No query provided"}), 400

        # Check if the query is a URL and extract the tweet ID
        if query.startswith("http") and "status" in query:
            tweet_id = extract_tweet_id(query)
            if not tweet_id:
                logging.error(f"Invalid Twitter URL provided: {query}")
                return jsonify({"error": "Invalid Twitter URL format"}), 400

            # Fetch the tweet by ID
            tweet = fetch_tweet_by_id(tweet_id, twitter_bearer_token)
            if not tweet:
                logging.info(f"No tweet found for ID: {tweet_id}")
                return jsonify({"error": "Tweet not found"}), 404
        else:
            # Treat the query as raw tweet text
            tweet = query

        # Process and analyze the single tweet
        cleaned_tweet = preprocess_text(tweet)
        probabilities = model_pipeline.predict_proba([cleaned_tweet])[0]
        max_prob = max(probabilities)
        sentiment = "positive" if probabilities[2] == max_prob else "neutral" if probabilities[1] == max_prob else "negative"

        result = {
            "tweet": tweet,
            "sentiment": sentiment,
            "confidence": round(max_prob * 100, 2)
        }

        logging.info(f"Sentiment analysis completed.")
        return jsonify(result)

    except Exception as e:
        logging.error(f"Error in /api/tweets route: {e}")
        return jsonify({"error": str(e)}), 500
 
try:   
    # Load the pre-trained vectorizer (assumes it was saved alongside the model)
    vectorizer = joblib.load('vectorizer.pkl')

    # Load the pre-trained spam detection model
    spam_model = joblib.load('spam_model.pkl')
except:
    logging.error("Error loading spam detection model. Make sure 'vectorizer.pkl' and 'spam_model.pkl' are in the correct path.")
    raise Exception("Error loading spam detection model.")

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
    
# Route for base URL
@app.route('/')
def index():
    return "API for YouTube Comment Analysis is running."

if __name__ == '__main__':
    app.run(debug=True)