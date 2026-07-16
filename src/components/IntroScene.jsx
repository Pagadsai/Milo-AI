import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useState, useEffect } from "react";
import Milo from "./Milo";

function IntroScene({ onStart }) {
  const [showMilo, setShowMilo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMilo(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#000",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={3} />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />

        {!showMilo && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        )}

        {showMilo && <Milo />}
      </Canvas>

      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "white",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "700",
            marginBottom: "10px",
            fontFamily: "Arial",
          }}
        >
          Hello Friend! I am Milo ✨
        </h1>

        <p
          style={{
            color: "#8ecae6",
            fontSize: "1.2rem",
            marginBottom: "25px",
          }}
        >
          Your Sign Language Buddy
        </p>

        <button
          onClick={onStart}
          style={{
            background: "#FFD700",
            color: "#000",
            border: "none",
            padding: "15px 40px",
            borderRadius: "35px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Click To Start
        </button>
      </div>
    </div>
  );
}

export default IntroScene;