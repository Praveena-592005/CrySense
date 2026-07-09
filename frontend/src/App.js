import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Splash from './Splash';

const ADVICE_MAP = {
  belly_pain: {
    icon: '/belly_pain_bg.png',
    text: 'Your baby might have tummy pain. Try gently massaging their belly or burping them.'
  },
  burping: {
    icon: '/burping_bg.png',
    text: 'Your baby needs to burp. Try holding them upright and patting their back.'
  },
  cold_hot: {
    icon: '/cold_hot_bg.png',
    text: 'Your baby might be uncomfortable. Check if they are too warm or cold and adjust their clothing.'
  },
  discomfort: {
    icon: '/discomfort_bg.png',
    text: 'Your baby is uncomfortable. Check their diaper or look for anything poking them.'
  },
  hungry: {
    icon: '/hungry_bg.png',
    text: 'Your baby is likely hungry. It might be time for a feeding.'
  },
  lonely: {
    icon: '/lonely_bg.png',
    text: 'Your baby might just need some cuddles and attention.'
  },
  scared: {
    icon: '/scared_bg.png',
    text: 'Your baby might be scared. Try soft whispering or soothing rocking.'
  },
  tired: {
    icon: '/tired_bg.png',
    text: 'Your baby is tired. It might be time for a nap in a quiet, dark place.'
  }
};

function App() {

  const [isStarted, setIsStarted] = useState(false);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const audioRef = useRef(null);

  const handleUpload = async (fileToUpload) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('file', fileToUpload);

   try {
        const response = await axios.post('http://localhost:8080/api/analyze', formData);
        setResult(response.data); 
    }
    catch (error) {

      console.error("Error uploading file", error);

      alert(
        "Error: " +
        (error.response?.data?.error || error.message)
      );

    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    mediaRecorderRef.current =
      new MediaRecorder(stream);

    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {

      const audioBlob = new Blob(
        audioChunksRef.current,
        { type: 'audio/wav' }
      );

      const url =
        URL.createObjectURL(audioBlob);

      setAudioUrl(url);

      handleUpload(audioBlob);
    };

    mediaRecorderRef.current.start();

    setIsRecording(true);
  };

  const stopRecording = () => {

    mediaRecorderRef.current.stop();

    setIsRecording(false);
  };

  const playAudio = () => {
  audioRef.current?.play();
};

const pauseAudio = () => {
  audioRef.current?.pause();
};

  if (!isStarted) {
    return (
      <Splash onStart={() => setIsStarted(true)} />
    );
  }

return (

  <div className="app-container">
<h1 className="main-title">Make Parenting Easy</h1>
  <h2 className="project-tagline">Decode your baby's communication</h2>
  <p className="subtitle">Powered by advanced AI to provide instant, soothing advice.</p>

    <div className="main-content">

      {/* LEFT SIDE */}
<div className="left-panel">

  <div className="upload-card">

    <h3>Upload Baby Cry Audio</h3>

    <label className="upload-box">

  {file ? (

    <>
      <div className="upload-icon">🎵</div>

      <div className="upload-title">
        Audio Selected
      </div>

      <div className="upload-subtitle">
        {file.name}
      </div>
    </>

  ) : (

    <>
      <div className="upload-icon">🎵</div>

      <div className="upload-title">
        Click to Select Audio
      </div>

      <div className="upload-subtitle">
        WAV, MP3 Supported
      </div>
    </>

  )}

  <input
    type="file"
    onChange={(e) =>
      setFile(e.target.files[0])
    }
  />

</label>

   <div className="button-group">

  <button
    className="analyze-btn"
    onClick={() =>
      file && handleUpload(file)
    }
    disabled={loading}
  >
    {loading
      ? 'Analyzing...'
      : 'Analyze Audio'}
  </button>

  <button
    onClick={
      isRecording
        ? stopRecording
        : startRecording
    }
    className={`record-btn ${
      isRecording ? "pulse" : ""
    }`}
  >
    {isRecording
      ? '🛑 Stop & Analyze'
      : ' Start Recording'}
  </button>

{audioUrl && (
  <div className="audio-preview">

    <audio
      ref={audioRef}
      src={audioUrl}
      hidden
    />

    <button
      className="audio-btn"
      onClick={playAudio}
    >
      ▶ Play
    </button>

    <button
      className="audio-btn"
      onClick={pauseAudio}
    >
      ⏸ Pause
    </button>

  </div>
)}

</div>

  </div>

</div>

      {/* RIGHT SIDE */}

<div className="right-panel">

  {!result ? (

    <div className="result-card placeholder-card">

      <img
        src="/baby_cry_bg.png"
        alt="Baby"
        className="placeholder-baby"
      />

      <h2 className="result-title">
        Waiting For Analysis 
      </h2>

      <p className="advice-text">
        Upload a baby cry audio or start a live
        recording to discover what your baby
        may be trying to communicate.
      </p>

    </div>

  ) : (

    <div className="result-card">

  <div className="sticker-wrapper">
    <img
      key={result.prediction}
      src={
        ADVICE_MAP[
          result.prediction
        ]?.icon
      }
      alt={result.prediction}
      className="sticker-large"
    />
  </div>

  <h2 className="result-title">

    {result.prediction
      .toUpperCase()
      .replace('_', ' ')}

  </h2>

  <p className="advice-text">

    {
      ADVICE_MAP[
        result.prediction
      ]?.text
    }

  </p>

</div>

  )}

</div>



    </div>

  </div>
);


}

export default App;
