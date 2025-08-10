// Day1.jsx
import React from "react";
// R3F se Canvas import (stage banane ke liye)
import { Canvas } from "@react-three/fiber";

export default function Day1() {
  return (
    // pura screen cover kare
    <div style={{ height: "100vh" }}>
      
      {/* Canvas = 3D stage */}
      <Canvas>
        {/* Light lagayi taaki object dikh sake */}
        <ambientLight intensity={0.5} /> 
        <directionalLight position={[5, 5, 5]} />

        {/* Mesh = object (shape + material) */}
        <mesh>
          {/* Geometry = shape */}
          <boxGeometry args={[1, 1, 1]} /> 
          {/* Material = color / texture */}
          <meshStandardMaterial color="pink" /> 
        </mesh>
      </Canvas>
      {/* Do Box ke liye */}
      <Canvas>
        {/* Light lagayi taaki object dikh sake */}
        <ambientLight intensity={0.5} /> 
        <directionalLight position={[8, 8, 8]} />

        {/* Mesh = object (shape + material) */}
        <mesh>
          {/* Geometry = shape */}
          <sphereGeometry args={[1, 1, 1]} /> 
          {/* Material = color / texture */}
          <meshStandardMaterial color="pink" /> 
        </mesh>
      </Canvas>
    </div>
  );
}