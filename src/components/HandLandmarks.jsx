import { useEffect, useRef } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

export default function HandLandmarks({
  videoRef,
  mode,
  isCollecting,
  captureLabel,
  onPredict,
}) {
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const runningRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
      );

      if (cancelled) return;

      landmarkerRef.current = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
          },
          runningMode: "VIDEO",
          numHands: 2,
        }
      );

      runningRef.current = true;
      startLoop();
    }

    function startLoop() {
      const loop = () => {
        if (!runningRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;

        if (!video || !canvas || !landmarker) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        if (video.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const result = landmarker.detectForVideo(
          video,
          performance.now()
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const draw = new DrawingUtils(ctx);

        if (result.landmarks && result.landmarks.length > 0) {
          result.landmarks.forEach((lm) => {
            draw.drawLandmarks(lm);
            draw.drawConnectors(lm, HandLandmarker.HAND_CONNECTIONS);

            // TRAIN MODE
            if (mode === "train" && isCollecting) {
              const dataset = JSON.parse(
                localStorage.getItem("milo_dataset") || "[]"
              );

              dataset.push({
                label: captureLabel,
                data: lm,
              });

              localStorage.setItem(
                "milo_dataset",
                JSON.stringify(dataset)
              );
            }
          });

          // LIVE MODE (send full result ONCE)
          if (mode === "live" && onPredict) {
            onPredict(result.landmarks);
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    }

    init();

    return () => {
      cancelled = true;
      runningRef.current = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [videoRef, mode, isCollecting, captureLabel, onPredict]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
      }}
    />
  );
}