import { useState } from "react";

export default function DataCollector({
  onStartCapture,
  onStopCapture,
}) {
  const [label, setLabel] = useState("");
  const [running, setRunning] = useState(false);

  function start() {
    if (!label.trim()) {
      alert("Enter label first (HELLO, YES, NO)");
      return;
    }

    setRunning(true);
    onStartCapture(label);
  }

  function stop() {
    setRunning(false);
    onStopCapture();
  }

  return (
    <div style={{ padding: 10, color: "white" }}>
      <h3>🧠 Data Collector</h3>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter label"
        style={{ padding: 6, marginRight: 10 }}
      />

      {!running ? (
        <button onClick={start} style={{ padding: 6 }}>
          Start Capture
        </button>
      ) : (
        <button onClick={stop} style={{ padding: 6 }}>
          Stop
        </button>
      )}
    </div>
  );
}