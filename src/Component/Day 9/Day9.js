// Day9.jsx
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { create } from "zustand";

// 📌 Zustand Store
const useStore = create((set) => ({
  boxColor: "orange",
  scale: 1,
  setBoxColor: (color) => set({ boxColor: color }),
  setScale: (scale) => set({ scale }),
}));

// 📌 Loader Component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-black/80 p-4 rounded-lg text-white text-center">
        <p className="text-lg font-bold">Loading...</p>
        <p>{progress.toFixed(0)} %</p>
      </div>
    </Html>
  );
}

// 📌 3D Box
function Box(props) {
  const meshRef = useRef();
  const { boxColor, scale } = useStore();

  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef} scale={scale} {...props} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={boxColor} />
    </mesh>
  );
}

// 📌 Tailwind UI Controls
function ControlsUI() {
  const { setBoxColor, setScale } = useStore();
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <button
        onClick={() => setBoxColor("orange")}
        className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
      >
        Orange
      </button>
      <button
        onClick={() => setBoxColor("skyblue")}
        className="bg-sky-500 text-white px-4 py-2 rounded shadow hover:bg-sky-600"
      >
        Sky Blue
      </button>
      <button
        onClick={() => setScale(1)}
        className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600"
      >
        Scale 1x
      </button>
      <button
        onClick={() => setScale(1.5)}
        className="bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800"
      >
        Scale 1.5x
      </button>
    </div>
  );
}

// 📌 Main Component
export default function Day9() {
  return (
    <div className="h-screen relative">
      {/* UI Buttons */}
      <ControlsUI />

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [4, 4, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

        {/* Floor */}
        <mesh
          position={[0, -1.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="lightgrey" />
        </mesh>

        {/* Box */}
        <Box position={[0, 1, 0]} />

        {/* Loader */}
        <Loader />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
