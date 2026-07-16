import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function LightTrail() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (!ref.current) return;

    ref.current.position.x = Math.sin(t) * 3;
    ref.current.position.y = Math.cos(t * 1.5) * 2;
    ref.current.position.z = Math.sin(t * 0.7);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial color="gold" />
    </mesh>
  );
}