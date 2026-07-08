from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import os
import uuid
import joblib
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

model = joblib.load('model.pkl')
CLASSES = ['belly_pain', 'burping', 'cold_hot', 'discomfort', 'hungry', 'lonely', 'scared', 'tired']

def extract_features(file_path):
    
    y, sr = librosa.load(file_path, sr=22050, mono=True)
    
    import gc
    gc.collect()

    mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    contrast = np.mean(librosa.feature.spectral_contrast(y=y, sr=sr).T, axis=0)
    zcr = np.mean(librosa.feature.zero_crossing_rate(y=y))
  
    features = np.hstack([mfcc, contrast, zcr])
    
    return features.reshape(1, -1)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    raw_path = f"raw_{uuid.uuid4()}.tmp"
    wav_path = f"temp_{uuid.uuid4()}.wav"
    file.save(raw_path)
    
    try:
       
        audio = AudioSegment.from_file(raw_path)
        audio.export(wav_path, format="wav")
        
        input_data = extract_features(wav_path)
        prediction = model.predict(input_data)[0]
        
        probs = model.predict_proba(input_data)
        confidence = float(np.max(probs))
        
        return jsonify({"prediction": prediction, "confidence": confidence})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(raw_path): os.remove(raw_path)
        if os.path.exists(wav_path): os.remove(wav_path)

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 5000)))