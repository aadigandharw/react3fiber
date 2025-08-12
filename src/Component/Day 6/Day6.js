// Day6.jsx
// 📌 Step 1: React, R3F & Drei imports
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// 📌 Step 2: Scene Component
function MiniHouse(props) {
  return (
    <>
      {/* === LIGHTS === */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* === GROUND === */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial color="lightgreen" />
      </mesh>

      {/* === HOUSE BODY === */}
      {/* Walls */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#ffe0b2" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.5, 2, 4]} />
        <meshStandardMaterial color="#ff7043" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 2.05]} castShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="brown" />
      </mesh>

      {/* Window */}
      <mesh position={[-1.5, 1, 2.05]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>
    </>
  );
}

// 📌 Step 3: Main Component
export default function Day6() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [6, 6, 6], fov: 50 }}
      >
        {/* OrbitControls for navigation */}
        <OrbitControls />

        {/* Scene */}
        <MiniHouse />
      </Canvas>
    </div>
  );
}
