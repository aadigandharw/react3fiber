// Day4.jsx

// 📌 Step 1: Import React & R3F
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";

// 📌 Step 2: OrbitControls import from drei
import { OrbitControls } from "@react-three/drei";

// 📌 Step 3: Interactive Box Component
function InteractiveBox() {
  // useState → color ko dynamic banane ke liye
  const [color, setColor] = useState("orange");

  return (
    <mesh
      position={[0, 0.5, 0]}
      castShadow
      // Mouse click event → color toggle karega
      onClick={() =>
        setColor(color === "orange" ? "hotpink" : "orange")
      }
      // Hover start → lightblue ho jayega
      onPointerOver={() => setColor("lightblue")}
      // Hover end → original color wapas
      onPointerOut={() => setColor("orange")}
    >
      {/* Cube shape */}
      <boxGeometry args={[1, 1, 1]} />
      {/* Material with dynamic color */}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// 📌 Step 4: Main Scene Component
export default function Day4() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [4, 4, 4], fov: 50 }}
      >
        {/* === LIGHTS === */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* === GROUND === */}
        <mesh
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="lightgrey" />
        </mesh>

        {/* === MAIN OBJECT === */}
        <InteractiveBox />

        {/* === ORBIT CONTROLS === */}
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  );
}
