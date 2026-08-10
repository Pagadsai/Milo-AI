import { useEffect, useState } from "react";
import "./WelcomeScreen.css";
import rabbit from "../assets/rabbit-logo.png";

export default function WelcomeScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading conversations...");

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();
    const endTime = startTime + duration;
    let timer;
    function update() {
      const now = Date.now();
      const elapsed = now - startTime;

      if (now >= endTime) {
        setProgress(100);
        setStatus("Ready!");
        timer = setTimeout(() => {
          onFinish();
        }, 300);

        return;
      }

      const value = (elapsed / duration) * 100;
      setProgress(value);

      if (value <= 25) {
        setStatus("Loading conversations...");
      } else if (value <= 55) {
        setStatus("Connecting AI...");
      } else if (value <= 85) {
        setStatus("Preparing sign recognition...");
      } else {
        setStatus("Ready!");
      }

      timer = setTimeout(update, 50);
    }

    update();
    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="welcome-screen">

      <div className="running-scene">
        <div className="sun"></div>

        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>

        <div className="leaf leaf1">🍃</div>
        <div className="leaf leaf2">🍃</div>
        <div className="leaf leaf3">🍃</div>

        <div className="dust dust1"></div>
        <div className="dust dust2"></div>

        <div className="rabbit-container">
          <img
            src={rabbit}
            alt="Milo Rabbit"
            className="rabbit"
          />
        </div>

        <div className="grass"></div>
      </div>

      <h1 className="logo">
        Milo
      </h1>

      <h2>Your AI Learning Companion</h2>

      <p className="subtitle">
        Learn • Sign • Speak
      </p>

      <div className="loading-status">
        {status}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>
  );
}