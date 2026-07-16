import { useEffect, useRef } from "react";

export default function Webcam({
  width = 420,
  height = 320,
  onStreamReady,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width,
            height,
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          if (onStreamReady) {
            onStreamReady(videoRef.current);
          }
        }
      } catch (err) {
        console.error("Camera Error:", err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [width, height, onStreamReady]);

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "15px",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          maxWidth: width,
          height: "auto",
          borderRadius: "12px",
          border: "3px solid #FFD700",
          transform: "scaleX(-1)",
        }}
      />
    </div>
  );
}