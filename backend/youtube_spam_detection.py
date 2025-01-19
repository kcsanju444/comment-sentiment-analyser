import pandas as pd
import numpy as np
import re
import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# Download necessary NLTK data
nltk.download('wordnet')
nltk.download('omw-1.4')

# Initialize lemmatizer
lemmatizer = WordNetLemmatizer()

# Load data
data = pd.read_csv("Youtube01.csv")

# Preprocess the data
data = data[['CONTENT', 'CLASS']]
data['CLASS'] = data['CLASS'].map({0: 'NOT A SPAM COMMENT', 1: 'SPAM COMMENT'})

# Function for text preprocessing
def preprocess_text(text):
    text = re.sub(r'\W', ' ', text)  # Remove non-word characters
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = text.lower()  # Convert to lowercase
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split()])  # Lemmatize words
    return text

data['CONTENT'] = data['CONTENT'].apply(preprocess_text)

# Split data into features and labels
x = np.array(data['CONTENT'])
y = np.array(data['CLASS'])

# Vectorize the text
cv = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), min_df=2, max_df=0.8)
x = cv.fit_transform(x)

# Split into training and testing data
xtrain, xtest, ytrain, ytest = train_test_split(x, y, train_size=0.8, random_state=42)

# Train the model using Logistic Regression
model = LogisticRegression(max_iter=1000)
model.fit(xtrain, ytrain)

# Evaluate the model
y_pred = model.predict(xtest)
print(classification_report(ytest, y_pred))

# Confusion Matrix and Accuracy
print(confusion_matrix(ytest, y_pred))
print("Accuracy:", accuracy_score(ytest, y_pred))

# Test with user input
S = input("Enter a comment: ")
d = cv.transform([S]).toarray()
prediction = model.predict(d)

print(f"The comment is: {prediction[0]}")
