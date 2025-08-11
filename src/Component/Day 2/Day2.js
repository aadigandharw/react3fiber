// Day2.jsx
// 📌 Step 1: React & R3F import
import React from "react";
import { Canvas } from "@react-three/fiber";

// 📌 Step 2: Component start
export default function Day2() {
  return (
    // 📌 Step 3: Full screen div
    <div style={{ height: "100vh" }}>
      
      {/* Canvas = R3F ka 3D stage */}
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        
        {/* === LIGHTS SECTION === */}
        
        {/* Ambient Light: poori scene me soft light daalti hai, shadow nahi banati */}
        <ambientLight intensity={0.3} />
        
        {/* Directional Light: ek specific direction se strong light, shadow banati hai */}
        <directionalLight 
          position={[5, 5, 5]}  // light ka position
          intensity={1}         // light ki brightness
          castShadow             // shadow banane ke liye
          shadow-mapSize-width={1024}   // shadow quality
          shadow-mapSize-height={1024}
        />

        {/* === GROUND SECTION === */}
        
        {/* Ground plane jo shadow receive karega */}
        <mesh 
          position={[0, -1, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
        >
          {/* Plane ka size */}
          <planeGeometry args={[10, 10]} />
          
          {/* Material */}
          <meshStandardMaterial color="grey" />
        </mesh>

        {/* === MAIN OBJECTS === */}

        {/* Cube */}
        <mesh position={[-1.5, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          {/* meshStandardMaterial → light ke sath realistic shading */}
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Sphere */}
        <mesh position={[1.5, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="skyblue" />
        </mesh>

        {/* Cylinder */}
        <mesh position={[0, 0.5, -2]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
          <meshStandardMaterial color="green" />
        </mesh>
        
      </Canvas>
    </div>
  );
}
