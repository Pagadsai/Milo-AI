import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Milo() {
  const groupRef = useRef();

  const { scene } = useGLTF("/Hitem3d-1781690984789.glb");

  useFrame(({ clock }) => {
  const t = clock.getElapsedTime();

  if (groupRef.current) {
    groupRef.current.position.x =
      Math.sin(t * 0.5) * 4;

    groupRef.current.position.y =
      2.5 + Math.sin(t * 1.5) * 0.8;

    groupRef.current.position.z =
      Math.cos(t * 0.5) * 2;

    groupRef.current.rotation.y = t * 0.5;
  }
});

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={2}
      />
    </group>
  );
}