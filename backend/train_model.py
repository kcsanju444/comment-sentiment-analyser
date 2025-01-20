import pandas as pd
import re
import string
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import Pipeline
import joblib
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import Counter
import emoji

# Download necessary NLTK data
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize stopwords and lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Load dataset
df = pd.read_csv('Datasets.csv')

# Function to extract emojis from text
def extract_emojis(text):
    return ''.join(char for char in text if char in emoji.EMOJI_DATA)

# Preprocessing function
def preprocess_text(text):
    text = text.lower()  # Lowercase the text
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stop_words])  # Remove stopwords & lemmatize
    return text

# Apply preprocessing to text and extract emojis
df['Emojis'] = df['Comment'].apply(extract_emojis)
df['Cleaned_Comment'] = df['Comment'].apply(preprocess_text)

# Combine text and emojis for analysis
df['Combined_Text'] = df['Cleaned_Comment'] + ' ' + df['Emojis']

# Check for class imbalance
print("Total comments:", len(df))
print("Comment distribution by sentiment:", df['Sentiment'].value_counts())

# Split dataset into train and test (70% train, 30% test)
X = df['Combined_Text']
y = df['Sentiment']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# Print dataset sizes
print(f"Training comments: {len(X_train)}")
print(f"Testing comments: {len(X_test)}")

# Print class distribution
print(f"Training set distribution: {Counter(y_train)}")
print(f"Testing set distribution: {Counter(y_test)}")

# Build the pipeline: TF-IDF vectorizer and Multinomial Naive Bayes
model_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1, 2), max_df=0.9, min_df=2)),  # Use bigrams
    ('nb', MultinomialNB(alpha=0.1))  # Lower alpha for better smoothing
])

# Train the model
model_pipeline.fit(X_train, y_train)

# Evaluate the model
y_pred = model_pipeline.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f'\nAccuracy: {accuracy * 100:.2f}%')
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Save the model for future use
joblib.dump(model_pipeline, 'sentiment_model.pkl')

print("Model training complete and saved as sentiment_model_with_emoji.pkl")
