// Day5.jsx
// 📌 Step 1: React, R3F & Drei imports
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// 📌 Step 2: Model Component
function Model(props) {
  // useGLTF hook → .glb / .gltf model load karta hai
  const gltf = useGLTF("/models/Laudge.glb"); // apna path replace kare
  
  return (
    <primitive 
      object={gltf.scene} // pura scene render karo
      scale={5}           // size badhao
      position={[0, -1, 0]} // thoda neeche rakho
      rotation={[0, Math.PI / 4, 0]} // 45 degree ghumao
      {...props}
    />
  );
}

// 📌 Step 3: Main Component
export default function Day5() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas shadows camera={{ position: [3, 3, 5], fov: 50 }}>
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
        />
        
        {/* Ground Plane */}
        <mesh 
          position={[0, -1.5, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="lightgrey" />
        </mesh>
        
        {/* 3D Model */}
        <Model />
        
        {/* Orbit Controls for navigation */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

// 📌 Step 4: GLTF Preload (Performance boost)
useGLTF.preload("/models/chair.glb");
