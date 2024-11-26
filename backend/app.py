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

# Initialize Flask app and allow CORS
app = Flask(__name__)
CORS(app)

# App configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/comment-analyser'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the app
db.init_app(app)

# Register the auth blueprint
app.register_blueprint(auth)

# Load the trained sentiment analysis model
model_pipeline = joblib.load('sentiment_model.pkl')

# Download NLTK stopwords and lemmatizer if needed
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

# Route for receiving the video URL and processing the comments
@app.route('/api/comments', methods=['POST'])
def analyze_comments():
    # Get the request data from frontend
    data = request.json
    video_url = data.get('video_url')
    api_key = "API key"  # Replace with your API key

    # Extract video ID from YouTube URL
    video_id = video_url.split("v=")[-1]

    # Fetch comments using YouTube Data API
    comments = fetch_youtube_comments(video_id, api_key)

    # Preprocess the comments
    cleaned_comments = [preprocess_text(comment) for comment in comments]

    # Convert the cleaned comments into a DataFrame for analysis
    df = pd.DataFrame(cleaned_comments, columns=['Cleaned_Comment'])

    # Analyze the comments using the pre-trained model and get probabilities
    probabilities = model_pipeline.predict_proba(df['Cleaned_Comment'])  # Get prediction probabilities

    # Process the probabilities to return the sentiment with the highest confidence
    results = []
    for i, comment in enumerate(comments):
        max_prob = max(probabilities[i])
        sentiment = "positive" if probabilities[i][2] == max_prob else "neutral" if probabilities[i][1] == max_prob else "negative"
        results.append({
            "comment": comment,
            "sentiment": sentiment,
            "confidence": round(max_prob * 100, 2)  # Return percentage confidence
        })

    # Return the result as JSON
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
