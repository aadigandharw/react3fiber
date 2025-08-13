import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

THREE.Cache.enabled = true;

function EnvironmentEXR({ file }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    new EXRLoader().load(file, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      texture.dispose();
      pmremGenerator.dispose();

      scene.background = envMap;
      scene.environment = envMap;

      console.log("✅ EXR Environment Loaded:", file);
    });
  }, [file, scene, gl]);

  return null;
}

function TexturedBox(props) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, "/textures/Wood.png");
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef} {...props} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial map={texture} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

export default function Day7() {
  return (
    <div style={{ height: "100vh" }}>
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

        {/* Rotating Box */}
        <TexturedBox position={[0, 1, 0]} />

        {/* Environment Map */}
        <EnvironmentEXR file="/hdr/studio.exr" />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
