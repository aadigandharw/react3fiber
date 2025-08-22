// Day8.jsx

// 📌 Step 1: Imports
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { create } from "zustand";


// 📌 Step 2: Zustand Store
const useStore = create((set) => ({
  boxColor: "orange",
  scale: 1,
  setBoxColor: (color) => set({ boxColor: color }),
  setScale: (scale) => set({ scale }),
}));

// 📌 Step 3: Box Component
function ControlledBox(props) {
  const boxColor = useStore((state) => state.boxColor);
  const scale = useStore((state) => state.scale);

  return (
    <mesh {...props} scale={scale} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={boxColor} />
    </mesh>
  );
}

// 📌 Step 4: Main Scene
export default function Day8() {
  const setBoxColor = useStore((state) => state.setBoxColor);
  const setScale = useStore((state) => state.setScale);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Side UI */}
      <div style={{ width: "200px", padding: "1rem", background: "#f0f0f0" }}>
        <h3>Controls</h3>
        <button onClick={() => setBoxColor("orange")}>Orange</button>
        <button onClick={() => setBoxColor("blue")}>Blue</button>
        <button onClick={() => setBoxColor("green")}>Green</button>
        <br /><br />
        <button onClick={() => setScale(1)}>Scale 1x</button>
        <button onClick={() => setScale(1.5)}>Scale 1.5x</button>
        <button onClick={() => setScale(2)}>Scale 2x</button>
      </div>

      {/* Right Side Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [4, 4, 6], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

          {/* Ground */}
          <mesh
            position={[0, -1.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="lightgrey" />
          </mesh>

          {/* Controlled Box */}
          <ControlledBox position={[0, 0, 0]} />

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
