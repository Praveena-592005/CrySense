import React from 'react';
import './Splash.css';

function Splash({ onStart }) {
  return (
    <div className="splash-container">
      <h1 className="splash-title">CrySense</h1>
      <p className="splash-tagline">AI-Powered Baby Cry Translator</p>
      
      <img 
        src="/baby_splash_bg.png" 
        alt="Click to enter CrySense-AI-Powered Baby Cry Translator" 
        className="splash-baby-img interactive-image" 
        onClick={onStart}
      />
      
      <p className="hint-text">Click the image to start</p>
    </div>
  );
}

export default Splash;