# Importing necessary libraries
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

# Step 1: Data Preprocessing
def load_and_preprocess_data(file_path):
    """
    Loads and preprocesses the dataset.
    Args:
        file_path (str): Path to the dataset file.

    Returns:
        DataFrame: Preprocessed dataset.
    """
    try:
        # Load the dataset
        df = pd.read_csv(file_path)
        
        # Check if essential columns exist
        if 'text' not in df.columns or 'spam' not in df.columns:
            raise ValueError("Dataset must contain 'text' and 'spam' columns.")
        
        # Ensure `spam` is binary (0 and 1)
        if not set(df['spam'].unique()).issubset({0, 1}):
            raise ValueError("The 'spam' column must contain only binary values (0 and 1).")
        
        return df
    except Exception as e:
        print(f"Error loading or preprocessing data: {e}")
        raise

# Step 2: Feature Extraction
def extract_features(data):
    """
    Converts email text into numerical features using TF-IDF Vectorizer.
    Args:
        data (DataFrame): Dataset containing email text.

    Returns:
        sparse matrix: TF-IDF features.
        TfidfVectorizer: Fitted vectorizer instance.
    """
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        features = vectorizer.fit_transform(data['text'])
        return features, vectorizer
    except Exception as e:
        print(f"Error during feature extraction: {e}")
        raise

# Step 3: Train/Test Split
def split_data(features, labels, test_size=0.2, random_state=42):
    """
    Splits the dataset into training and testing sets.
    Args:
        features (sparse matrix): Feature matrix.
        labels (Series): Label vector.
        test_size (float): Proportion of the dataset to include in the test split.
        random_state (int): Random seed for reproducibility.

    Returns:
        tuple: Split data (X_train, X_test, y_train, y_test).
    """
    return train_test_split(features, labels, test_size=test_size, random_state=random_state)

# Step 4: Model Training
def train_model(X_train, y_train):
    """
    Trains a Naive Bayes classifier on the training data.
    Args:
        X_train (sparse matrix): Training features.
        y_train (Series): Training labels.

    Returns:
        MultinomialNB: Trained model.
    """
    model = MultinomialNB()
    model.fit(X_train, y_train)
    return model

# Step 5: Model Evaluation
def evaluate_model(model, X_test, y_test):
    """
    Evaluates the trained model on the test data.
    Args:
        model (MultinomialNB): Trained model.
        X_test (sparse matrix): Test features.
        y_test (Series): Test labels.

    Returns:
        None
    """
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

# Step 6: Save Model and Vectorizer
def save_model_and_vectorizer(model, vectorizer, model_path, vectorizer_path):
    """
    Saves the trained model and vectorizer to disk.
    Args:
        model: Trained model.
        vectorizer: Fitted vectorizer.
        model_path (str): Path to save the model.
        vectorizer_path (str): Path to save the vectorizer.

    Returns:
        None
    """
    try:
        with open(model_path, 'wb') as model_file:
            pickle.dump(model, model_file)
        with open(vectorizer_path, 'wb') as vectorizer_file:
            pickle.dump(vectorizer, vectorizer_file)
        print("Model and vectorizer saved successfully.")
    except Exception as e:
        print(f"Error saving model or vectorizer: {e}")
        raise

# File path
dataset_path = "emails.csv"

# Load and preprocess data
try:
    data = load_and_preprocess_data(dataset_path)
    print(data.head())
except Exception as e:
    print(f"Error: {e}")
    exit()

# Extract features
try:
    X, tfidf_vectorizer = extract_features(data)
except Exception as e:
    print(f"Error: {e}")
    exit()

# Split data
X_train, X_test, y_train, y_test = split_data(X, data['spam'])

# Train model
spam_classifier = train_model(X_train, y_train)

# Evaluate model
evaluate_model(spam_classifier, X_test, y_test)

# Save model and vectorizer
save_model_and_vectorizer(spam_classifier, tfidf_vectorizer, 'spam_model.pkl', 'vectorizer.pkl')
