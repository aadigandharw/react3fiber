// src/Component/FutureHome.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// ---------- CONFIG ----------
const cfg = {
  // Ghar ka approx size (X = width, Z = depth)
  houseSize: { x: 14, z: 9 },        // ~14m x 9m
  wall: { height: 2.8, thickness: 0.18 },
  floorY: 0,
  scale: 1,                           // poore model ke liye global scale
  colors: {
    wall: "#f2f2f2",
    floor: "#dadada",
    bedroomFloor: "#e9e2d0",
    bathFloor: "#d0e7f5",
    balconyFloor: "#e8e8e8",
    sofa: "#8a5a44",
    bed: "#b7c1d1",
    table: "#cccccc",
  },
};

// ---------- HELPERS ----------
function Floor({ w, d, y = 0, color = "#ddd", receiveShadow = true }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={receiveShadow}>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Wall({ from = [0,0], to = [1,0], height, thickness, color }) {
  // 2D points on XZ plane → make a box
  const dx = to[0] - from[0];
  const dz = to[1] - from[1];
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dz, dx);
  const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];

  return (
    <mesh
      position={[mid[0], height/2, mid[1]]}
      rotation={[0, -angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[len, height, thickness]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function RectRoom({ x, z, w, d, h, t, color, openings = [] }) {
  // axis-aligned rectangle with optional gaps (openings) in walls
  // openings: [{edge:'N'|'S'|'E'|'W', from:number, to:number}] in local meters from left/bottom
  const edges = useMemo(() => {
    // build wall segments with gaps
    const segs = [];
    const add = (edge, x1, z1, x2, z2) => segs.push([[x1, z1], [x2, z2]]);
    const hasGap = (edge) => openings.filter(o => o.edge === edge);

    // bottom (S): from (x, z) → (x+w, z)
    let gaps = hasGap("S").sort((a,b)=>a.from-b.from);
    let cursor = 0;
    gaps.forEach(g => {
      if (g.from > cursor) add("S", x+cursor, z, x+g.from, z);
      cursor = g.to;
    });
    if (cursor < w) add("S", x+cursor, z, x+w, z);

    // top (N): (x, z+d) → (x+w, z+d)
    gaps = hasGap("N").sort((a,b)=>a.from-b.from); cursor=0;
    gaps.forEach(g => {
      if (g.from > cursor) add("N", x+cursor, z+d, x+g.from, z+d);
      cursor = g.to;
    });
    if (cursor < w) add("N", x+cursor, z+d, x+w, z+d);

    // left (W): (x, z) → (x, z+d)
    gaps = hasGap("W").sort((a,b)=>a.from-b.from); cursor=0;
    gaps.forEach(g => {
      if (g.from > cursor) add("W", x, z+cursor, x, z+g.from);
      cursor = g.to;
    });
    if (cursor < d) add("W", x, z+cursor, x, z+d);

    // right (E): (x+w, z) → (x+w, z+d)
    gaps = hasGap("E").sort((a,b)=>a.from-b.from); cursor=0;
    gaps.forEach(g => {
      if (g.from > cursor) add("E", x+w, z+cursor, x+w, z+g.from);
      cursor = g.to;
    });
    if (cursor < d) add("E", x+w, z+cursor, x+w, z+d);

    return segs;
  }, [x,z,w,d,openings]);

  return (
    <>
      {edges.map(([[x1,z1],[x2,z2]], i)=>(
        <Wall key={i}
          from={[x1, z1]}
          to={[x2, z2]}
          height={h}
          thickness={t}
          color={color}
        />
      ))}
    </>
  );
}

// ---------- SIMPLE FURNITURE ----------
const Sofa = ({ position=[0,0,0] }) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[2.2, 0.6, 0.8]} />
      <meshStandardMaterial color={cfg.colors.sofa}/>
    </mesh>
    <mesh position={[0,0.5,-0.3]} castShadow>
      <boxGeometry args={[2.2, 0.5, 0.2]} />
      <meshStandardMaterial color={cfg.colors.sofa}/>
    </mesh>
    <mesh position={[-1.1,0.3,0]} castShadow>
      <boxGeometry args={[0.1, 0.6, 0.8]} />
      <meshStandardMaterial color={cfg.colors.sofa}/>
    </mesh>
    <mesh position={[1.1,0.3,0]} castShadow>
      <boxGeometry args={[0.1, 0.6, 0.8]} />
      <meshStandardMaterial color={cfg.colors.sofa}/>
    </mesh>
  </group>
);

const CoffeeTable = ({ position=[0,0,0] }) => (
  <mesh position={position} castShadow>
    <boxGeometry args={[0.9, 0.1, 0.6]} />
    <meshStandardMaterial color={cfg.colors.table}/>
  </mesh>
);

const Bed = ({ position=[0,0,0] }) => (
  <group position={position}>
    <mesh castShadow>
      <boxGeometry args={[2, 0.35, 1.6]} />
      <meshStandardMaterial color={cfg.colors.bed}/>
    </mesh>
    <mesh position={[0,0.45,-0.7]} castShadow>
      <boxGeometry args={[2, 0.25, 0.2]} />
      <meshStandardMaterial color={cfg.colors.bed}/>
    </mesh>
    <mesh position={[0,0.6,-0.8]} castShadow>
      <boxGeometry args={[2, 0.1, 0.05]} />
      <meshStandardMaterial color={"white"}/>
    </mesh>
  </group>
);

// ---------- PLAN OVERLAY (optional) ----------
function PlanOverlay({ w, d, y=0.01, visible }) {
  const [tex] = useState(() => new THREE.TextureLoader().load("/floorplan.jpg"));
  useEffect(()=>{ if(tex){ tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping; tex.needsUpdate = true; }},[tex]);
  if (!visible) return null;
  return (
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,y,0]}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={tex} transparent opacity={0.55} side={THREE.DoubleSide}/>
    </mesh>
  );
}

// ---------- MAIN ----------
export default function FutureHome() {
  const [showPlan, setShowPlan] = useState(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "f") setShowPlan(s => !s); // toggle floorplan
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { x:W, z:D } = cfg.houseSize;
  const { height:H, thickness:T } = cfg.wall;

  // Rooms (roughly mapped from your plan)
  // Coordinate system: center of house at (0,0). Left = -X, Right = +X, Up = +Z
  // We'll place the rectangle with its bottom-left at (-W/2, -D/2)
  const origin = { x: -W/2, z: -D/2 };

  // Bedroom rectangle (right-bottom area)
  const bedroom = {
    x: origin.x + W*0.62,
    z: origin.z + D*0.10,
    w: W*0.32,
    d: D*0.45,
  };

  // Bathroom rectangle (top-right corner)
  const bathroom = {
    x: origin.x + W*0.62,
    z: origin.z + D*0.65,
    w: W*0.27,
    d: D*0.22,
  };

  // Hallway strip (right side middle)
  const hall = {
    x: origin.x + W*0.62,
    z: origin.z + D*0.50,
    w: W*0.33,
    d: D*0.12,
  };

  // Balcony (left side outside)
  const balcony = {
    x: origin.x - W*0.18,   // stick outside a bit
    z: origin.z + D*0.20,
    w: W*0.30,
    d: D*0.55,
  };

  return (
    <div style={{height:"100vh"}}>
      <Canvas
        shadows
        camera={{ position: [12, 9, 14], fov: 45, near: 0.1, far: 200 }}
      >
        {/* Lights */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[10,12,6]} intensity={1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />

        {/* Base floor for whole house */}
        <Floor w={W} d={D} y={cfg.floorY} color={cfg.colors.floor} />

        {/* Balcony floor */}
        <mesh position={[balcony.x + balcony.w/2, cfg.floorY + 0.01, balcony.z + balcony.d/2]} rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[balcony.w, balcony.d]} />
          <meshStandardMaterial color={cfg.colors.balconyFloor} />
        </mesh>

        {/* Outer walls (simple rectangle with a gap (door) on East side) */}
        <RectRoom
          x={origin.x} z={origin.z} w={W} d={D} h={H} t={T} color={cfg.colors.wall}
          openings={[
            { edge: "E", from: D*0.45, to: D*0.60 }, // main entry gap
            { edge: "W", from: D*0.20, to: D*0.75 }, // balcony opening
          ]}
        />

        {/* Bedroom walls with a doorway on West edge */}
        <RectRoom
          x={bedroom.x} z={bedroom.z} w={bedroom.w} d={bedroom.d} h={H} t={T} color={cfg.colors.wall}
          openings={[
            { edge: "W", from: bedroom.d*0.40, to: bedroom.d*0.60 },
          ]}
        />
        {/* Bedroom floor tone */}
        <mesh position={[bedroom.x + bedroom.w/2, 0.005, bedroom.z + bedroom.d/2]} rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[bedroom.w - 0.2, bedroom.d - 0.2]} />
          <meshStandardMaterial color={cfg.colors.bedroomFloor}/>
        </mesh>

        {/* Bathroom walls with a door on South edge */}
        <RectRoom
          x={bathroom.x} z={bathroom.z} w={bathroom.w} d={bathroom.d} h={H} t={T} color={cfg.colors.wall}
          openings={[
            { edge: "S", from: bathroom.w*0.30, to: bathroom.w*0.55 },
          ]}
        />
        {/* Bathroom floor tone */}
        <mesh position={[bathroom.x + bathroom.w/2, 0.006, bathroom.z + bathroom.d/2]} rotation={[-Math.PI/2,0,0]} receiveShadow>
          <planeGeometry args={[bathroom.w - 0.2, bathroom.d - 0.2]} />
          <meshStandardMaterial color={cfg.colors.bathFloor}/>
        </mesh>

        {/* Hallway indicated with thin rails (low walls) */}
        <mesh position={[hall.x + hall.w/2, 0.45, hall.z]} rotation={[0,0,0]}>
          <boxGeometry args={[hall.w, 0.9, 0.05]} />
          <meshStandardMaterial color={"#cfcfcf"}/>
        </mesh>
        <mesh position={[hall.x + hall.w/2, 0.45, hall.z + hall.d]} rotation={[0,0,0]}>
          <boxGeometry args={[hall.w, 0.9, 0.05]} />
          <meshStandardMaterial color={"#cfcfcf"}/>
        </mesh>

        {/* Living + Kitchen area furniture (very simple proxies) */}
        <Sofa position={[-2, 0.3, 0]} />
        <CoffeeTable position={[-0.4, 0.25, 0]} />
        {/* Dining table proxy */}
        <mesh position={[-3.5, 0.78, 2.0]} castShadow>
          <boxGeometry args={[2.2, 0.06, 1.1]} />
          <meshStandardMaterial color={cfg.colors.table}/>
        </mesh>
        {/* Kitchen counter proxy */}
        <mesh position={[2.2, 0.9, 3.2]} castShadow>
          <boxGeometry args={[3.5, 0.9, 0.6]} />
          <meshStandardMaterial color={"#dddddd"}/>
        </mesh>

        {/* Bedroom bed */}
        <Bed position={[bedroom.x + bedroom.w/2, 0.25, bedroom.z + bedroom.d/2]} />

        {/* Optional: overlay the 2D plan for alignment (press 'F' to toggle) */}
        <PlanOverlay w={W} d={D} visible={showPlan} />

        {/* Controls */}
        <OrbitControls makeDefault target={[0,0,0]} />
        <Html position={[-W/2, 2.9, D/2]}>
          <div style={{background:"#0008", color:"#fff", padding:"6px 10px", borderRadius:8, fontFamily:"sans-serif", fontSize:12}}>
            Future Home Preview · Keys: <b>F</b> toggle plan
          </div>
        </Html>
      </Canvas>
    </div>
  );
}
