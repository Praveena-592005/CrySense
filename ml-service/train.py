import os
import librosa
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

def extract_features(y, sr):
    
    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    contrast = np.mean(librosa.feature.spectral_contrast(y=y, sr=sr).T, axis=0)
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=y))
    return np.hstack([mfcc, contrast, zcr])

def add_noise(y):
    return y + 0.005 * np.random.randn(len(y))

def time_stretch(y, rate=0.8):
    return librosa.effects.time_stretch(y, rate=rate)

DATA_DIR = '../data/baby_cry_dataset'
features = []
labels = []

for category in os.listdir(DATA_DIR):
    cat_path = os.path.join(DATA_DIR, category)
    if os.path.isdir(cat_path):
        for file in os.listdir(cat_path):
            if file.endswith('.wav'):
                y, sr = librosa.load(os.path.join(cat_path, file), duration=3)
              
                features.append(extract_features(y, sr))
                labels.append(category)
                
                features.append(extract_features(add_noise(y), sr))
                labels.append(category)
                features.append(extract_features(time_stretch(y), sr))
                labels.append(category)

X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=200, class_weight='balanced', max_depth=15)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print(f"Improved Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%")
print(classification_report(y_test, y_pred))

plt.figure(figsize=(12, 8))

cm = confusion_matrix(y_test, y_pred)

sns.heatmap(cm, annot=True, fmt='d', cmap='coolwarm', 
            center=cm.mean(),  
            xticklabels=np.unique(labels), yticklabels=np.unique(labels),
            cbar_kws={'label': 'Number of Predictions'})

plt.title('Confusion Matrix: Model Classification Performance', fontsize=16)
plt.xlabel('Predicted Cry Type', fontsize=12)
plt.ylabel('Actual Cry Type', fontsize=12)
plt.xticks(rotation=45, ha='right')
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()

joblib.dump(clf, 'model.pkl')


