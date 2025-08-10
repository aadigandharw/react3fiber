import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Yeh cube sirf Canvas ke andar chalega
function RotatingCube() {
  const meshRef = useRef();

  // Animation loop
  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  );
}

export default function Day1() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <RotatingCube />
      </Canvas>
    </div>
  );
}
