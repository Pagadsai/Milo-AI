import { useEffect, useRef, useState } from "react";
import { FiCamera, FiCameraOff, FiCheck, FiTrash2 } from "react-icons/fi";
import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";
import { recognizeSign } from "../sign/recognizeSign";
export default function CameraPanel({
    stats,
    signWords,
    liveSentence,
    isBuildingSentence,
    onSignDetected,
    onUseSigns,
    onClearSigns,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const frameRef = useRef(null);
  const runningRef = useRef(false);
  const [showGestures, setShowGestures] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const candidateRef = useRef({
    label: null,
    frames: 0,
    lastEmitted: 0,
    lastLabel: null,
  });

  const [cameraState, setCameraState] = useState("off");
  const [detectedSign, setDetectedSign] = useState("");
  const [error, setError] = useState("");
  const [sessionTime, setSessionTime] = useState("0 sec");
  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor(
        (Date.now() - stats.sessionStart) / 1000
      );

      if (seconds < 60) {
        setSessionTime(`${seconds} sec`);
      } else if (seconds < 3600) {
        const mins = Math.floor(seconds / 60);
        setSessionTime(`${mins} min`);
      } else {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        setSessionTime(`${hrs} hr ${mins} min`);
      }
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [stats.sessionStart]);
  useEffect(() => stopCamera, []);

  async function createLandmarker() {
    if (landmarkerRef.current) return landmarkerRef.current;

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
    );

    landmarkerRef.current = await HandLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath: "/models/hand_landmarker.task",
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      }
    );

    return landmarkerRef.current;
  }

  async function startCamera() {
    if (runningRef.current) return;

    setCameraState("loading");
    setError("");

    try {
      const landmarker = await createLandmarker();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      const video = videoRef.current;
      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();
      runningRef.current = true;
      setCameraState("live");

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const drawing = new DrawingUtils(context);

      let frameCounter = 0;

      function renderFrame() {
        if (!runningRef.current) return;

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        frameCounter++;

        if (frameCounter % 2 === 0) {
          const result = landmarker.detectForVideo(
            video,
            performance.now()
          );

          const landmarks = result.landmarks?.[0];
          if (landmarks) {
            drawing.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              {
                color: "#9af7d1",
                lineWidth: 3,
              }
            );

            drawing.drawLandmarks(landmarks, {
              color: "#ffca58",
              fillColor: "#101c2e",
              radius: 4,
            });

            const sign = recognizeSign(landmarks);

            trackStableSign(sign);
          } else {
            trackStableSign(null);
          }
        }

        context.restore();

        frameRef.current =
          requestAnimationFrame(renderFrame);
      }

      renderFrame();
    } catch (cameraError) {
      console.error(cameraError);
      setCameraState("error");
      setError(
        cameraError?.name === "NotAllowedError"
          ? "Camera permission denied."
          : "Unable to start camera."
      );
      stopCamera(false);
    }
  }

  function trackStableSign(label) {
    const candidate = candidateRef.current;

    if (!label) {
      candidate.label = null;
      candidate.frames = 0;
      candidate.lastLabel = null;
      setDetectedSign("");
      return;
    }

    if (candidate.label === label) {
      candidate.frames++;
    } else {
      candidate.label = label;
      candidate.frames = 1;
    }

    setDetectedSign(label);
    const now = Date.now();

    if (
      candidate.frames >= 15 &&
      now - candidate.lastEmitted > 2150
    ) {
      if (candidate.lastLabel !== label) {
        onSignDetected(label);
        candidate.lastLabel = label;
      }

      candidate.lastEmitted = now;

      candidate.label = null;
      candidate.frames = 0;
    }
  }

  function stopCamera(updateState = true) {
    runningRef.current = false;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");

      ctx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      canvasRef.current.width = 0;
      canvasRef.current.height = 0;
    }

    candidateRef.current = {
      label: null,
      frames: 0,
      lastEmitted: 0,
      lastLabel: null,
    };

    setDetectedSign("");
    setError("");

    if (updateState) {
      setCameraState("off");
    }
  }

  const isLive = cameraState === "live";
  return (
    <aside className="vision-panel" aria-label="Sign language camera">
      <div className="vision-heading">
        <div>
          <span className="eyebrow">Sign to text</span>
          <h2>Live Interpreter</h2>
        </div>

        <span className={`camera-status ${cameraState}`}>
          <span />
          {cameraState === "live"
            ? "Live"
            : cameraState === "loading"
            ? "Starting"
            : "Off"}
        </span>
      </div>

      <div className={`camera-stage ${isLive ? "live" : ""}`}>
        <video ref={videoRef} playsInline muted />
        <canvas ref={canvasRef} />

        {!isLive && (
          <div className="camera-placeholder">
            <div className="camera-orb">
              <FiCamera />
            </div>

            <strong>Show Milo a sign</strong>

            <p>
              Your video is processed locally and is never uploaded.
            </p>
          </div>
        )}

        {detectedSign && (
          <div className="detected-chip">
            Recognising · {detectedSign}
          </div>
        )}
      </div>

      {error && (
        <p className="camera-error">
          {error}
        </p>
      )}

      <button
        className={`camera-button ${isLive ? "stop" : ""}`}
        type="button"
        disabled={cameraState === "loading"}
        onClick={isLive ? () => stopCamera() : startCamera}
      >
        {isLive ? <FiCameraOff /> : <FiCamera />}

        {cameraState === "loading"
          ? "Starting camera..."
          : isLive
          ? "Stop camera"
          : "Start camera"}
      </button>

      <div className="sign-output">
        <div className="sign-output-heading">
          <span>Detected Phrase</span>

          <button
            type="button"
            onClick={onClearSigns}
            disabled={!signWords.length}
          >
            <FiTrash2 />
            {" "}Clear
          </button>
        </div>

        <div className="sign-transcript">
          {signWords.length ? (
            signWords.map((word, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  background: "#2b3d5f",
                  color: "#fff",
                  padding: "8px 14px",
                  margin: "6px",
                  borderRadius: "20px",
                  fontWeight: "600",
                }}
              >
                {word}
              </span>
            ))
          ) : (
            "Your recognised signs will appear here"
          )}
        </div>
        <div className="ai-sentence-box">
          <div className="ai-sentence-heading">
            Natural Sentence
          </div>

          <div className="ai-sentence">
            {liveSentence || "Start signing to build a sentence..."}
          </div>
          {isBuildingSentence && (
            <div className="sentence-status">
              ✨ Understanding sign...
            </div>
          )}
        </div>
        <button
          className="use-signs-button"
          type="button"
          onClick={onUseSigns}
          disabled={!signWords.length}
        >
          <FiCheck />
          {" "}Add to message
        </button>
        <div className="stats-section">

          <button
              className="stats-toggle"
              onClick={() => setShowStats(!showStats)}
          >
              📊 Chat Statistics {showStats ? "▲" : "▼"}
          </button>

          {showStats && (
              <div className="stats-panel">

                  <div className="stat-row">
                      <span>💬 Messages Sent</span>
                      <strong>{stats.messagesSent}</strong>
                  </div>

                  <div className="stat-row">
                      <span>🤖 AI Replies</span>
                      <strong>{stats.aiReplies}</strong>
                  </div>

                  <div className="stat-row">
                      <span>✋ Signs Detected</span>
                      <strong>{stats.signsDetected}</strong>
                  </div>

                  <div className="stat-row">
                      <span>📝 Sentences Built</span>
                      <strong>{stats.sentencesBuilt}</strong>
                  </div>

                  <div className="stat-row">
                      <span>⏱ Session Time</span>
                      <strong>{sessionTime}</strong>
                  </div>

              </div>
          )}

      </div>
      </div>

      <div className="gesture-section">

          <button
              className="gesture-toggle"
              onClick={() => setShowGestures(!showGestures)}
          >
              📚 Supported Gestures {showGestures ? "▲" : "▼"}
          </button>

          {showGestures && (
              <div className="supported-gestures">
                  <div>👋 HELLO</div>
                  <div>👍 YES</div>
                  <div>✋ STOP</div>
                  <div>👌 OK</div>
                  <div>✌️ PEACE</div>
                  <div>☝️ I</div>
                  <div>🤝 HELP</div>
                  <div>🙏 THANK YOU</div>
                  <div>❤️ LOVE</div>
              </div>
          )}

      </div>
    </aside>
  );
}