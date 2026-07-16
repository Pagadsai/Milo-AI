import { useEffect,useState } from "react";
import "./WelcomeScreen.css";

export default function WelcomeScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading conversations...");
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 1;
      if (value <= 25) {
        setStatus("Loading conversations...");
        setProgress(value);
      }
      else if (value <= 55) {
        setStatus("Connecting AI...");
        setProgress(value);
      }
      else if (value <= 85) {
        setStatus("Preparing sign recognition...");
        setProgress(value);
      }
      else if (value < 100) {
       setStatus("Ready!");
       setProgress(value);
      }
      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
         onFinish();
        }, 300);
      }
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-screen">

      <div className="robot">🤖</div>

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