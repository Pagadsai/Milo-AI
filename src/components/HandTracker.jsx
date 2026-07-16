import { useEffect, useRef } from "react";

import * as mpHands from "@mediapipe/hands";

import {
  drawConnectors,
  drawLandmarks,
} from "@mediapipe/drawing_utils";

import { Camera } from "@mediapipe/camera_utils";

export default function HandTracker({
  onResults,
  width = 640,
  height = 480,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new mpHands.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx.save();

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        results.image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(
            ctx,
            landmarks,
            mpHands.HAND_CONNECTIONS,
            {
              color: "#FFD700",
              lineWidth: 4,
            }
          );

          drawLandmarks(
            ctx,
            landmarks,
            {
              color: "#00FF00",
              radius: 4,
            }
          );
        }

        if (onResults) {
          onResults({
            landmarks:
              results.multiHandLandmarks,
            handedness:
              results.multiHandedness,
          });
        }
      }

      ctx.restore();
    });

    handsRef.current = hands;

    const camera = new Camera(
      videoRef.current,
      {
        width,
        height,

        onFrame: async () => {
          if (
            handsRef.current &&
            videoRef.current
          ) {
            await handsRef.current.send({
              image: videoRef.current,
            });
          }
        },
      }
    );

    camera.start();

    cameraRef.current = camera;
    
        return () => {
          if (cameraRef.current) {
            try {
              cameraRef.current.stop();
            } catch (e) {
              console.log(e);
            }
          }
    
          if (handsRef.current) {
            try {
              handsRef.current.close();
            } catch (e) {
              console.log(e);
            }
          }
        };
      }, [width, height, onResults]);
    
      return (
        <div
          style={{
            position: "relative",
            width,
            height,
            borderRadius: "15px",
            overflow: "hidden",
            background: "#000",
            border: "3px solid #FFD700",
          }}
        >
          <video
            ref={videoRef}
            style={{
              display: "none",
            }}
            playsInline
          />
    
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              transform: "scaleX(-1)",
            }}
          />
    
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "8px 14px",
              background: "rgba(0,0,0,0.6)",
              color: "#FFD700",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            ✋ MediaPipe Hand Tracking
          </div>
        </div>
      );
    }