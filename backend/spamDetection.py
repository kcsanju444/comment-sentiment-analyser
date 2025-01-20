# Importing necessary libraries
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

# Step 1: Data Preprocessing

# Load the dataset (path to your local file)
file_path = "spam_dataset"

# Read dataset into a pandas dataframe
df = pd.read_csv(file_path, sep='\t', header=None, names=['label', 'message'])

# Check the first few rows of the dataset
print(df.head())

# Encode labels (ham=0, spam=1)
df['label'] = df['label'].map({'ham': 0, 'spam': 1})

# Step 2: Feature Extraction (Convert text to numerical format)
# Use TF-IDF Vectorizer to convert text messages into numerical features
vectorizer = TfidfVectorizer(stop_words='english')

# Transform messages into TF-IDF features
X = vectorizer.fit_transform(df['message'])

# Step 3: Train/Test Split
# Split the dataset into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, df['label'], test_size=0.2, random_state=42)

# Step 4: Model Training
# Using Naive Bayes for classification
model = MultinomialNB()
model.fit(X_train, y_train)

# Step 5: Model Evaluation

# Predict the labels on the test set
y_pred = model.predict(X_test)

# Evaluate the model using classification report and accuracy score
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# dump the model
pickle.dump(model, open('spam_model.pkl', 'wb'))
pickle.dump(vectorizer, open('vectorizer.pkl', 'wb'))