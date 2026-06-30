import joblib
import librosa
import numpy as np
import os
import pandas as pd

os.chdir(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load('model.pkl')

def extract_features(file_path):
    y, sr = librosa.load(file_path, duration=3, offset=0.5)
    ae = np.mean(librosa.feature.rms(y=y))
    rms = np.mean(librosa.feature.rms(y=y))
    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    stft = np.mean(np.abs(librosa.stft(y)))
    sc = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    sban = np.mean(librosa.feature.spectral_bandwidth(y=y, sr=sr))
    scon = np.mean(librosa.feature.spectral_contrast(y=y, sr=sr))
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs, axis=1)
    features = [ae, rms, zcr, stft, sc, sban, scon]
    features.extend(mfccs_mean)
    return np.array(features).reshape(1, -1)

def test_file(file_path):
    features = extract_features(file_path)
    probs = model.predict_proba(features)
    prediction = np.argmax(probs)
    label_map = {0: "Belly Pain", 1: "Burping", 2: "Discomfort", 3: "Hungry", 4: "Tired"}
    print(f"Probabilities for {os.path.basename(file_path)}: {probs}")
    print(f"Prediction: {label_map.get(prediction, 'Unknown')}")

test_file(r'C:\Users\23cse\OneDrive\Documents\AI-Infant-Care\data\bu1.wav')