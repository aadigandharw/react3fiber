import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';

// Rotating cube component
function RotatingBox() {
  const boxRef = useRef();

  // Animation frame loop
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01; // X-axis rotation
      boxRef.current.rotation.y += 0.01; // Y-axis rotation
    }
  });

  return (
    <mesh ref={boxRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} /> {/* Cube dimensions */}
      <meshStandardMaterial color="orange" /> {/* Material color */}
    </mesh>
  );
}

// Main Day3 component
function Day3() {
  return (
    <Canvas style={{ height: "100vh" }}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />

      {/* Rotating box */}
      <RotatingBox />
    </Canvas>
  );
}

export default Day3;
