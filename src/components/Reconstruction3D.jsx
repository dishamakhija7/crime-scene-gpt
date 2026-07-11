import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Video, Compass, ArrowUp, ArrowLeft, ArrowRight, Share2, MapPin, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import AlternativeScenarios from './AlternativeScenarios';

function HeatmapNode({ position, radius, color, intensity = 0.5 }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial color={color} transparent opacity={intensity * 0.2} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[radius * 0.6, 32]} />
        <meshBasicMaterial color={color} transparent opacity={intensity * 0.5} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[radius * 0.2, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={intensity * 0.8} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale = 1, type = 'round' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 6]} />
        <meshStandardMaterial color="#3f2e1a" roughness={0.9} flatShading />
      </mesh>
      {/* Foliage */}
      {type === 'pine' ? (
        <group position={[0, 4, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <coneGeometry args={[2.5, 4, 6]} />
            <meshStandardMaterial color="#065f46" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow>
            <coneGeometry args={[2, 3, 6]} />
            <meshStandardMaterial color="#064e3b" roughness={0.8} flatShading />
          </mesh>
        </group>
      ) : (
        <group position={[0, 4, 0]}>
          <mesh castShadow>
            <dodecahedronGeometry args={[2.2, 0]} />
            <meshStandardMaterial color="#166534" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0.8, 1.2, 0.5]} castShadow>
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[-0.8, -0.5, -0.8]} castShadow>
            <dodecahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color="#14532d" roughness={0.8} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Building({ position, width = 6, depth = 6, height = 12, color = '#d4d4d8', windows = true }) {
  const windowData = useMemo(() => {
    if (!windows) return null;
    const rows = Math.floor(height / 2) - 1;
    const cols = Math.floor(width / 1.5);
    const data = [];
    for (let r = 0; r < rows; r++) {
      const rowArr = [];
      for (let c = 0; c < cols; c++) {
        rowArr.push(Math.random() > 0.6); // 40% chance of lit window
      }
      data.push(rowArr);
    }
    return data;
  }, [height, width, windows]);

  return (
    <group position={position}>
      {/* Main Building Body */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Roof Parapet */}
      <mesh position={[0, height + 0.2, 0]}>
        <boxGeometry args={[width * 1.02, 0.4, depth * 1.02]} />
        <meshStandardMaterial color="#a1a1aa" roughness={0.9} />
      </mesh>

      {/* Windows */}
      {windowData && (
        <group position={[0, 0, depth / 2 + 0.01]}>
          {windowData.map((row, r) => (
            <group key={`row-${r}`} position={[0, -height/2 + 2.5 + r * 2, 0]}>
              {row.map((isLit, c) => (
                <mesh key={`col-${c}`} position={[-width / 2 + 1 + c * 1.5, 0, 0]}>
                  <planeGeometry args={[0.8, 1.2]} />
                  <meshStandardMaterial 
                    color={isLit ? "#fde047" : "#1e293b"} 
                    emissive={isLit ? "#fef08a" : "#000000"} 
                    emissiveIntensity={isLit ? 1.5 : 0} 
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}
    </group>
  );
}

function Streetlight({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pole */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
        <meshStandardMaterial color="#52525b" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Arm */}
      <mesh position={[1, 7.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2, 8]} />
        <meshStandardMaterial color="#52525b" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* Lamp Head */}
      <mesh position={[2, 7.8, 0]} castShadow>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.6} />
      </mesh>
      {/* Bulb & Light */}
      <mesh position={[2, 7.65, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} />
      </mesh>
      <spotLight position={[2, 7.6, 0]} target-position={[2, 0, 0]} angle={0.8} penumbra={0.5} intensity={12} distance={30} decay={1.5} color="#fef08a" castShadow />
    </group>
  );
}

function LowPolyCityEnvironment() {
  return (
    <group position={[0, 0, 0]}>
      {/* Base Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1c1917" roughness={1} />
      </mesh>

      {/* Main Roads (Asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[16, 100]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Sidewalks */}
      {[
        [-29, -29], [29, -29], [-29, 29], [29, 29]
      ].map(([x, z], idx) => (
        <mesh key={`sidewalk-${idx}`} position={[x, 0.1, z]} receiveShadow castShadow>
          <boxGeometry args={[42, 0.3, 42]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
        </mesh>
      ))}

      {/* Center Double Lines */}
      <group position={[0, -0.03, 0]}>
        {[-30, 30].map(z => (
          <mesh key={`d-line-z-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]}>
            <planeGeometry args={[0.4, 40]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        ))}
        {[-30, 30].map(x => (
          <mesh key={`d-line-x-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, 0]}>
            <planeGeometry args={[40, 0.4]} />
            <meshStandardMaterial color="#fcd34d" />
          </mesh>
        ))}
      </group>

      {/* Crosswalks (Zebra Stripes) */}
      <group position={[0, -0.03, 0]}>
        {[8, -8].map(zOffset => 
          Array.from({length: 10}).map((_, i) => (
            <mesh key={`cw-z-${zOffset}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-6.75 + i * 1.5, 0, zOffset]}>
              <planeGeometry args={[0.8, 3]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))
        )}
        {[8, -8].map(xOffset => 
          Array.from({length: 10}).map((_, i) => (
            <mesh key={`cw-x-${xOffset}-${i}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[xOffset, 0, -6.75 + i * 1.5]}>
              <planeGeometry args={[0.8, 3]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))
        )}
      </group>

      {/* Buildings */}
      <group>
        {/* Top Left Block */}
        <Building position={[-16, 0, -20]} width={10} depth={18} height={14} color="#78716c" />
        <Building position={[-30, 0, -14]} width={16} depth={10} height={20} color="#b45309" />
        <Building position={[-28, 0, -28]} width={12} depth={12} height={10} color="#0f172a" />
        
        {/* Top Right Block */}
        <Building position={[18, 0, -18]} width={12} depth={14} height={22} color="#475569" />
        <Building position={[32, 0, -16]} width={14} depth={10} height={16} color="#d97706" />
        
        {/* Bottom Left Block */}
        <Building position={[-18, 0, 18]} width={14} depth={12} height={12} color="#e2e8f0" />
        <Building position={[-32, 0, 24]} width={12} depth={14} height={18} color="#94a3b8" />
        
        {/* Bottom Right Block */}
        <Building position={[16, 0, 20]} width={10} depth={16} height={15} color="#fcd34d" />
        <Building position={[30, 0, 24]} width={16} depth={12} height={10} color="#ef4444" />
      </group>

      {/* Trees */}
      <group>
        <Tree position={[-10, 0.25, -12]} type="round" scale={0.8} />
        <Tree position={[-20, 0.25, -10]} type="pine" scale={1.1} />
        <Tree position={[10, 0.25, -14]} type="round" scale={0.9} />
        <Tree position={[22, 0.25, -10]} type="round" scale={0.7} />
        <Tree position={[-12, 0.25, 12]} type="pine" scale={0.85} />
        <Tree position={[14, 0.25, 14]} type="round" scale={1.0} />
      </group>

      {/* Streetlights */}
      <group>
        <Streetlight position={[-8, 0.25, -12]} rotationY={Math.PI / 2} />
        <Streetlight position={[8, 0.25, -12]} rotationY={Math.PI / 2} />
        <Streetlight position={[-8, 0.25, 12]} rotationY={-Math.PI / 2} />
        <Streetlight position={[8, 0.25, 12]} rotationY={-Math.PI / 2} />
        <Streetlight position={[-12, 0.25, -8]} rotationY={0} />
        <Streetlight position={[12, 0.25, -8]} rotationY={Math.PI} />
        <Streetlight position={[-12, 0.25, 8]} rotationY={Math.PI} />
        <Streetlight position={[12, 0.25, 8]} rotationY={Math.PI} />
      </group>
    </group>
  );
}

function ScooterBody({ color = "#3b82f6", scale = 1 }) {
  return (
    <group scale={[scale, scale, scale]}>
      {/* Front Shield (Vespa style) */}
      <mesh position={[0, 0.8, 0.6]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Floor Deck */}
      <mesh position={[0, 0.35, 0.1]} castShadow>
        <boxGeometry args={[0.6, 0.1, 1.0]} />
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </mesh>
      {/* Rear Engine / Body */}
      <mesh position={[0, 0.6, -0.4]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.9, -0.4]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.8]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      {/* Steering Column */}
      <mesh position={[0, 0.9, 0.6]} rotation={[-0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 1.3, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* Headlight Housing */}
      <mesh position={[0, 1.3, 0.55]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Headlight Bulb */}
      <mesh position={[0, 1.3, 0.66]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <spotLight position={[0, 1.3, 0.7]} target-position={[0, 0, 10]} angle={0.4} penumbra={0.5} intensity={10} distance={30} color="#fffaed" castShadow />
      
      {/* Taillight */}
      <mesh position={[0, 0.65, -0.86]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0.65, -0.9]} intensity={2} distance={5} color="#ff0000" />
      
      {/* Wheels */}
      <mesh position={[0, 0.25, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, 0.25, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {/* Wheel Hubs */}
      <mesh position={[0.08, 0.25, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.25, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} />
      </mesh>
    </group>
  );
}

function VehicleBody({ texture, color, accent, scale = 1 }) {
  return (
    <group scale={[scale, scale, scale]}>
      {/* Main Body Lower */}
      <mesh castShadow receiveShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[2.3, 0.8, 4.8]} />
        <meshPhysicalMaterial map={texture} color={color} metalness={0.7} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Cabin / Roof */}
      <mesh castShadow position={[0, 1.55, -0.3]}>
        <boxGeometry args={[1.8, 0.6, 2.6]} />
        <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.2} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[0, 1.55, 1.01]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[1.6, 0.65]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Rear Window */}
      <mesh position={[0, 1.55, -1.61]} rotation={[0.25, Math.PI, 0]}>
        <planeGeometry args={[1.6, 0.65]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Side Windows */}
      <mesh position={[0.91, 1.55, -0.3]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[2.4, 0.5]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-0.91, 1.55, -0.3]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[2.4, 0.5]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      
      {/* Front Grille */}
      <mesh position={[0, 0.9, 2.41]}>
        <planeGeometry args={[1.2, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
      {/* Front Bumper */}
      <mesh position={[0, 0.55, 2.45]}>
        <boxGeometry args={[2.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      {/* Rear Bumper */}
      <mesh position={[0, 0.55, -2.45]}>
        <boxGeometry args={[2.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      
      {/* Headlights & Taillights */}
      <mesh position={[0.8, 1.05, 2.41]}>
        <boxGeometry args={[0.5, 0.2, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[-0.8, 1.05, 2.41]}>
        <boxGeometry args={[0.5, 0.2, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
      </mesh>
      
      <spotLight position={[0.8, 1.05, 2.5]} target-position={[0.8, 0, 15]} angle={0.5} penumbra={0.6} intensity={25} distance={50} decay={1.5} color="#fffaed" castShadow />
      <spotLight position={[-0.8, 1.05, 2.5]} target-position={[-0.8, 0, 15]} angle={0.5} penumbra={0.6} intensity={25} distance={50} decay={1.5} color="#fffaed" castShadow />
      
      <mesh position={[0.8, 1.05, -2.41]}>
        <boxGeometry args={[0.5, 0.2, 0.1]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[-0.8, 1.05, -2.41]}>
        <boxGeometry args={[0.5, 0.2, 0.1]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2.5} />
      </mesh>
      <pointLight position={[0, 1.05, -2.7]} intensity={5} distance={10} color="#ff0000" />
      
      {/* Wheels */}
      {[[1.05, 0.45, 1.6], [-1.05, 0.45, 1.6], [1.05, 0.45, -1.6], [-1.05, 0.45, -1.6]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.45, 32]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI/2]} position={[(i % 2 === 0 ? 0.23 : -0.23), 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SimulationScene({ isPlaying, playbackSpeed, currentTime, setCurrentTime, selectedScenario, activeTab, setIsPlaying }) {
  const carARef = useRef();
  const carBRef = useRef();
  const pedRef = useRef();
  const impactRef = useRef();
  const dustRef = useRef();
  const debrisRefs = useRef([]);
  const collisionTime = 5.0;

  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const carATexture = useMemo(() => {
    return textureLoader.load('/car_red.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textureLoader]);

  const carBTexture = useMemo(() => {
    return textureLoader.load('/car_green.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textureLoader]);

  useFrame((state, delta) => {
    if (!isPlaying || activeTab === 'heatmap') return;

    setCurrentTime((prev) => {
      const next = prev + (delta * playbackSpeed);
      // Auto pause at 6.5s to show AI Summary
      if (prev < 6.5 && next >= 6.5) {
        setTimeout(() => setIsPlaying(false), 0);
        return 6.5;
      }
      return next >= 10.0 ? 0.0 : next;
    });

    const carASpeedMod = selectedScenario === 'B' ? 1.4 : 1.0;
    const impactActive = currentTime > collisionTime - 0.35 && currentTime < collisionTime + 0.8;

    if (carARef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        // Approaching the intersection
        carARef.current.position.set(-25 + progress * 23.5 * carASpeedMod, 0.02, -2.0);
        carARef.current.rotation.y = -Math.PI / 2; // Face direction of travel (+X)
      } else {
        const diff = currentTime - collisionTime;
        
        if (selectedScenario === 'A') {
          // Scenario A: Red Light & Flee. Car A blasts through, swerves slightly right, maintains high speed.
          carARef.current.position.set(-1.5 + diff * 18, 0.02, -2.0 + diff * 2.5);
          carARef.current.rotation.y = -Math.PI / 2 + 0.15; // Swerve right
        } else if (selectedScenario === 'B') {
          // Scenario B: Late Brake. Car A brakes hard, slows down, clips, heavy swerve to avoid.
          carARef.current.position.set(-1.5 + diff * 6, 0.02, -2.0 + diff * 4.5);
          carARef.current.rotation.y = -Math.PI / 2 + 0.6; // Heavy swerve right
        } else {
          // Scenario C: Brake Failure. Car A plows dead straight at constant speed.
          carARef.current.position.set(-1.5 + diff * 12, 0.02, -2.0);
          carARef.current.rotation.y = -Math.PI / 2; // Dead straight
        }
      }
    }

    if (carBRef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        // Approaching from South
        carBRef.current.position.set(2.0, 0.02, 25 - progress * 23.2);
        carBRef.current.rotation.y = Math.PI; // Face direction of travel (-Z)
      } else {
        const diff = currentTime - collisionTime;
        
        if (selectedScenario === 'A') {
          // Scenario A: Struck in rear quarter. Spins out violently and is pushed into intersection.
          carBRef.current.position.set(2.0 + diff * 4.5, 0.02, 1.8 - diff * 3);
          carBRef.current.rotation.y = Math.PI + diff * 4; // Violent spin
        } else if (selectedScenario === 'B') {
          // Scenario B: Clipped lightly. Mild spin, stays mostly on path.
          carBRef.current.position.set(2.0 + diff * 2.5, 0.02, 1.8 - diff * 1.5);
          carBRef.current.rotation.y = Math.PI + diff * 1.5; // Mild spin
        } else {
          // Scenario C: T-Boned. Thrown far into the intersection.
          carBRef.current.position.set(2.0 + diff * 8, 0.02, 1.8 - diff * 5);
          carBRef.current.rotation.y = Math.PI + diff * 8; // Extreme spin
        }
      }
    }

    if (pedRef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        pedRef.current.position.set(selectedScenario === 'C' ? -3.5 + progress * 2.3 : -3.5, 0.9, 5.5);
        pedRef.current.rotation.y = selectedScenario === 'C' ? THREE.MathUtils.lerp(0, 0.16, progress) : 0;
      } else {
        pedRef.current.position.set(selectedScenario === 'C' ? -1.0 : -3.5, 0.9, 5.5);
      }
    }

    if (impactRef.current) {
      impactRef.current.scale.setScalar(impactActive ? 1.5 + Math.sin(state.clock.elapsedTime * 15) * 0.2 : 0.001);
      impactRef.current.rotation.z = state.clock.elapsedTime * 2;
    }

    // Debris and dust only appear right at and after collision
    const postCollision = currentTime > collisionTime && currentTime < collisionTime + 2.5;
    const timeSinceCollision = currentTime - collisionTime;

    if (dustRef.current) {
      dustRef.current.visible = postCollision;
      if (postCollision) {
        dustRef.current.children.forEach((child, idx) => {
          child.position.y = 0.28 + Math.sin(state.clock.elapsedTime * 5 + idx) * 0.15;
          child.position.x += delta * (idx % 2 === 0 ? 1 : -1) * 2;
          child.position.z += delta * (idx % 3 === 0 ? 1 : -1) * 2;
          child.rotation.z += delta * 5;
        });
      } else {
        // Reset dust positions
        dustRef.current.children.forEach((child, idx) => {
          child.position.set((-2.2 + (idx % 5) * 1.1), 0.25, -1.8 + Math.floor(idx / 5) * 0.9);
        });
      }
    }

    debrisRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      mesh.visible = postCollision;
      if (postCollision) {
        mesh.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 8 + idx) * 0.1;
        mesh.position.x += delta * 4 * (idx % 2 === 0 ? 1.5 : 0.5);
        mesh.position.z -= delta * 3;
        mesh.rotation.x += delta * 15;
        mesh.rotation.y += delta * 10;
      } else {
        // Reset debris
        mesh.position.set(-0.3 + (idx % 4) * 0.25, 0.2, -0.4 + Math.floor(idx / 4) * 0.3);
      }
    });
  });

  return (
    <>
      {/* Deep night sky fog */}
      <fog attach="fog" args={['#0f172a', 20, 200]} />
      {/* Warm ambient night lighting */}
      <ambientLight intensity={0.4} color="#e2e8f0" />
      <hemisphereLight args={['#1e293b', '#0f172a', 0.8]} />
      
      {/* Dim directional moonlight */}
      <directionalLight position={[14, 30, 12]} intensity={0.5} color="#cbd5e1" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />

      <LowPolyCityEnvironment />

      {activeTab !== 'heatmap' && (
        <>
          <Line points={[[-20, 0.02, -2], [-1.5, 0.02, -2], [5, 0.02, 7]]} color="#fb7185" lineWidth={2.4} opacity={0.76} transparent />
          <Line points={[[2, 0.02, 20], [2, 0.02, 1.8], [15, 0.02, -0.8]]} color="#4ade80" lineWidth={2.4} opacity={0.76} transparent />

          <group ref={impactRef} position={[0.2, 0.12, 0]}>
            <mesh>
              <ringGeometry args={[0.3, 2.6, 64]} />
              <meshBasicMaterial color="#fde68a" transparent opacity={0.45} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.45, 18, 18]} />
              <meshBasicMaterial color="#f97316" transparent opacity={0.18} />
            </mesh>
          </group>

          <group ref={dustRef}>
            {Array.from({ length: 16 }).map((_, i) => (
              <mesh key={i} position={[(-2.2 + (i % 5) * 1.1), 0.25, -1.8 + Math.floor(i / 5) * 0.9]}>
                <boxGeometry args={[0.16, 0.16, 0.16]} />
                <meshStandardMaterial color="#64748b" roughness={0.95} transparent opacity={0.4} />
              </mesh>
            ))}
          </group>

          <group>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh
                key={i}
                ref={(node) => {
                  debrisRefs.current[i] = node;
                }}
                position={[-0.3 + (i % 4) * 0.25, 0.2, -0.4 + Math.floor(i / 4) * 0.3]}
              >
                <boxGeometry args={[0.12, 0.12, 0.12]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#fb923c' : '#f8fafc'} roughness={0.3} metalness={0.6} />
              </mesh>
            ))}
          </group>

          <group ref={carARef} position={[-20, 0.02, -2]}>
            <VehicleBody color="#ef4444" accent="#f87171" />
            {!['scenarios', 'heatmap'].includes(activeTab) && (
              <Html distanceFactor={14} position={[0, 2.9, 0]} center>
                <div className="bg-[#06070b]/90 border border-rose-500/80 text-white font-mono text-[10px] px-2 py-1 rounded shadow-2xl backdrop-blur-md select-none whitespace-nowrap">
                  <span className="font-bold text-rose-400">Red SUV</span> • {selectedScenario === 'B' ? '55 km/h' : '43 km/h'}
                </div>
              </Html>
            )}
            {!isPlaying && Math.abs(currentTime - 6.5) < 0.1 && (
              <Html distanceFactor={10} position={[0, 6, 0]} center zIndexRange={[100, 0]}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-col items-center">
                  <div className="bg-[#0b1320]/95 border border-[#ef4444]/40 p-2.5 rounded shadow-[0_10px_40px_rgba(239,68,68,0.3)] backdrop-blur-xl whitespace-nowrap">
                    <p className="text-[11px] text-[#fca5a5] font-semibold tracking-wider uppercase mb-0.5">Primary Cause</p>
                    <p className="text-[13px] text-white font-bold">SUV — 70 km/h</p>
                  </div>
                  <div className="w-0.5 h-12 bg-gradient-to-b from-[#ef4444]/60 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]" />
                </motion.div>
              </Html>
            )}
          </group>

          <group ref={carBRef} position={[2, 0.02, 20]}>
            <ScooterBody color="#38bdf8" />
            {!['scenarios', 'heatmap'].includes(activeTab) && (
              <Html distanceFactor={14} position={[0, 2.9, 0]} center>
                <div className="bg-[#06070b]/90 border border-emerald-500/80 text-white font-mono text-[10px] px-2 py-1 rounded shadow-2xl backdrop-blur-md select-none whitespace-nowrap">
                  <span className="font-bold text-emerald-400">Blue Scooter</span> • 38 km/h
                </div>
              </Html>
            )}
            {!isPlaying && Math.abs(currentTime - 6.5) < 0.1 && (
              <Html distanceFactor={10} position={[0, 5, 0]} center zIndexRange={[100, 0]}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative flex flex-col items-center">
                  <div className="bg-[#0b1320]/95 border border-[#f59e0b]/40 p-2.5 rounded shadow-[0_10px_40px_rgba(245,158,11,0.3)] backdrop-blur-xl whitespace-nowrap">
                    <p className="text-[11px] text-[#fcd34d] font-semibold tracking-wider uppercase mb-0.5">Primary Cause</p>
                    <p className="text-[13px] text-white font-bold">Scooter — 30 km/h</p>
                  </div>
                  <div className="w-0.5 h-8 bg-gradient-to-b from-[#f59e0b]/60 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]" />
                </motion.div>
              </Html>
            )}
          </group>

          {/* Central Cause Tooltip */}
          {!isPlaying && Math.abs(currentTime - 6.5) < 0.1 && (
            <group position={[-1.5, 0.02, 1.8]}>
              <Html distanceFactor={15} position={[0, 4, 0]} center zIndexRange={[100, 0]}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative flex flex-col items-center">
                  <div className="bg-[#0f172a]/95 border border-[#00E5FF]/40 p-3 rounded-lg shadow-[0_10px_40px_rgba(0,229,255,0.2)] backdrop-blur-xl max-w-[200px] text-center">
                    <p className="text-[11px] text-[#00E5FF] font-semibold tracking-wider uppercase mb-1">Primary Cause:</p>
                    <p className="text-sm text-white font-bold leading-tight">Unsafe high-speed overtaking</p>
                  </div>
                </motion.div>
              </Html>
            </group>
          )}

          <group ref={pedRef} position={[-3.5, 0.9, 5.5]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.24, 0.72, 6, 12]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.42} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.38, 0]} castShadow>
              <boxGeometry args={[0.9, 0.85, 0.5]} />
              <meshStandardMaterial color="#111827" roughness={0.5} />
            </mesh>
            {!['scenarios', 'heatmap'].includes(activeTab) && (
              <Html distanceFactor={11} position={[0, 1.9, 0]} center>
                <div className="bg-[#06070b]/90 border border-yellow-500/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap">
                  <span className="text-yellow-400 font-bold">PEDESTRIAN</span>
                </div>
              </Html>
            )}
          </group>
        </>
      )}

      {activeTab === 'heatmap' && (
        <group position={[0, 0, 0]}>
          {/* Path from East (Car A) */}
          <HeatmapNode position={[18, 0.02, -2]} radius={8} color="#f59e0b" intensity={0.4} />
          <HeatmapNode position={[10, 0.02, -2]} radius={10} color="#f59e0b" intensity={0.6} />
          
          {/* Path from South (Car B) */}
          <HeatmapNode position={[2, 0.02, 15]} radius={8} color="#f59e0b" intensity={0.4} />
          <HeatmapNode position={[2, 0.02, 8]} radius={10} color="#f59e0b" intensity={0.6} />
          
          {/* Impact Zone (Red Hot) */}
          <HeatmapNode position={[2, 0.02, -2]} radius={14} color="#ef4444" intensity={0.8} />
        </group>
      )}
    </>
  );
}

export default function Reconstruction3D({ onGoBack, onGoToReport, onGoToTimeline, onGoToHeatmap }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [selectedScenario, setSelectedScenario] = useState('A');
  const [activeTab, setActiveTab] = useState('3d');
  const [cameraMode, setCameraMode] = useState('orbit');
  const controlsRef = useRef();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const camera = controls.object;
    const target = new THREE.Vector3(0, 0, 0);

    switch (cameraMode) {
      case 'top':
        camera.position.set(0, 40, 0.5);
        camera.up.set(0, 0, 1);
        break;
      case 'front':
        camera.position.set(0, 12, 35);
        camera.up.set(0, 1, 0);
        break;
      case 'left':
        camera.position.set(-35, 12, 0);
        camera.up.set(0, 1, 0);
        break;
      default:
        // Match the high-angle isometric perspective of the reference image
        camera.position.set(-25, 28, 25);
        camera.up.set(0, 1, 0);
        break;
    }

    camera.lookAt(target);
    controls.target.copy(target);
    controls.update();
  }, [cameraMode]);
  return (
    <div className="min-h-[100dvh] bg-[#05060A] text-white p-3 md:p-6 pb-24 md:pb-6 flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] flex flex-col flex-1 gap-4 md:gap-6">
        <div className="flex flex-col gap-2 pt-2 md:pt-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#a78bfa] text-center md:text-left">Forensic Reconstruction</p>
        </div>

        <div className="flex-1 rounded-3xl md:rounded-[40px] border border-white/10 bg-[#0B0F19]/80 shadow-[0_20px_80px_rgba(31,25,54,0.4)] backdrop-blur-2xl overflow-hidden flex flex-col">
          <div className="flex flex-col gap-4 border-b border-white/10 bg-[#0c1224]/90 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onGoBack} className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#c084fc] transition hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="space-y-1 text-left">
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#a78bfa]/80">Case</p>
                <p className="text-sm font-semibold text-white">INV-2025-0715</p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#94a3b8]/80">City Rd / Intersection</p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111827]/80 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#7dd3fc]">
                <MapPin className="h-3.5 w-3.5" />
                LIVE
              </span>
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#c084fc] transition hover:bg-white/10">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#c084fc] transition hover:bg-white/10 text-xl leading-none">
                ⋮
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 py-4 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {[
                { id: '3d', label: '3D View' },
                { id: 'timeline', label: 'Timeline' },
                { id: 'map', label: 'Map View' },
                { id: 'scenarios', label: 'Alternative Scenarios' },
                { id: 'heatmap', label: 'Heatmap' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'timeline') {
                      onGoToTimeline?.();
                      return;
                    }
                    setActiveTab(tab.id);
                  }}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-[#7c3aed] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]' : 'bg-white/5 text-[#d1d5db] hover:bg-white/10'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-[#7c3aed]/40 bg-[#7c3aed]/10 px-4 py-2 text-sm text-[#ede9fe] transition hover:bg-[#7c3aed]/15">
              <Sparkles className="h-4 w-4 text-[#c4b5fd]" />
              AI Summary
            </button>
          </div>

          <div className="relative bg-[#05070d] flex-1 min-h-[40vh] md:min-h-[60vh] w-full overflow-hidden flex flex-col">
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_35%)]" />
            <div className="absolute inset-0 z-0">
              <Canvas camera={{ position: [0, 30, 20], fov: 38, near: 0.1, far: 120 }}>
                <color attach="background" args={['#06060a']} />
              <SimulationScene 
                isPlaying={isPlaying} 
                playbackSpeed={playbackSpeed} 
                currentTime={currentTime} 
                setCurrentTime={setCurrentTime}
                selectedScenario={selectedScenario}
                activeTab={activeTab}
                setIsPlaying={setIsPlaying}
              />
                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableRotate={true}
                  enableZoom={false}
                  maxPolarAngle={Math.PI / 2.3}
                  minDistance={10}
                  maxDistance={50}
                />
              </Canvas>
            </div>
              {activeTab === 'map' && (
                <div className="absolute top-6 right-6 z-20 w-72 rounded-3xl border border-white/10 bg-[#060912]/90 p-4 text-sm text-slate-300 shadow-2xl">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-[#94a3b8] mb-2">Map View</p>
                  <p className="text-xs text-white font-semibold mb-3">Aerial incident overlay</p>
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-white/10 p-3">
                    <div className="h-full w-full rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_25%)] p-2">
                      <div className="h-full border border-dashed border-white/10 rounded-2xl bg-[#02040b]/80 flex flex-col justify-between p-2">
                        <div className="text-[10px] text-slate-500">Scene footprint</div>
                        <div className="grid grid-cols-3 gap-1">
                          {Array.from({ length: 9 }).map((_, idx) => (
                            <span key={idx} className="block h-2 rounded bg-white/10" />
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-2">Orientation: North-up</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NEW ALTERNATIVE SCENARIOS OVERLAY */}
              {activeTab === 'scenarios' && (
                <AlternativeScenarios 
                  caseId="INV-2025-0715"
                  onBack={() => setActiveTab('3d')}
                  onCompare={() => setActiveTab('3d')}
                />
              )}

              {/* NEW HEATMAP OVERLAY */}
              {activeTab === 'heatmap' && (
                <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center font-sans">
                  
                  {/* FLOATING PANELS */}
                  
                  {/* Risk / Impact Probability (Top Left) */}
                  <div className="absolute top-6 left-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[220px] z-40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <div className="text-white text-[11px] font-bold tracking-wide mb-5">Risk / Impact Probability</div>
                    <div className="flex gap-4">
                      <div className="w-4 h-36 rounded-full bg-gradient-to-b from-[#ff0000] via-[#ffff00] via-[#00ff00] to-[#00aaff]" />
                      <div className="flex flex-col justify-between h-36 text-[11px] text-gray-300 font-medium">
                        <span>High</span>
                        <span>Low</span>
                      </div>
                    </div>
                  </div>

                  {/* Layers (Top Right) */}
                  <div className="absolute top-6 right-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[200px] z-40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <div className="text-white text-[11px] font-bold tracking-wide mb-5">Layers</div>
                    <div className="flex flex-col gap-3.5">
                      {[
                        { label: 'Heatmap', active: true },
                        { label: 'Trajectories', active: true },
                        { label: 'Vehicles', active: true },
                        { label: 'Roads', active: false },
                        { label: 'Labels', active: true }
                      ].map(item => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-[11px] text-gray-200">{item.label}</span>
                          <div className={`w-8 h-4.5 rounded-full p-[2px] flex items-center transition-colors cursor-pointer ${item.active ? 'bg-[#00E5FF]' : 'bg-[#2a2e3d]'}`}>
                            <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform ${item.active ? 'translate-x-[14px]' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scenario Confidence (Bottom Left) */}
                  <div className="absolute bottom-6 left-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[220px] z-40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <div className="text-white text-[11px] font-bold tracking-wide mb-2">Scenario Confidence</div>
                    <div className="text-[#00E5FF] text-[38px] font-bold leading-none mb-1">94%</div>
                    <div className="text-[#00E5FF] text-[10px] mb-3 tracking-wide">High Confidence</div>
                    <div className="w-[140px] h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-[#00E5FF]" />
                    </div>
                  </div>

                  {/* Legend (Bottom Right) */}
                  <div className="absolute bottom-6 right-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[220px] z-40 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
                    <div className="flex flex-col gap-4 text-[11px] text-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-6 border-t-[2.5px] border-dashed border-[#00E5FF]" />
                        <span>Car A Path</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 border-t-[2.5px] border-dashed border-[#ff8c00]" />
                        <span>Car B Path</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)] ml-1.5" />
                        <span className="ml-2.5">Impact Point</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            
            <AnimatePresence>
              {!isPlaying && Math.abs(currentTime - 6.5) < 0.1 && activeTab === '3d' && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="absolute top-2 right-2 z-40 w-72 md:w-80 rounded-[20px] border border-white/10 bg-[#0B0F19]/90 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
                    <h3 className="font-bold text-white text-sm md:text-base">AI Summary</h3>
                    <button onClick={() => setIsPlaying(true)} className="text-slate-400 hover:text-white transition">
                      <X className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="space-y-1 relative">
                      <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-slate-400">Most Likely Scenario:</p>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2">Hit-and-Run</h4>
                      <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00E5FF] w-[94%]" />
                      </div>
                      <p className="text-xs text-slate-300 mt-2 font-medium">Confidence score: <span className="text-white font-bold">94%</span></p>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <h5 className="text-xs md:text-sm font-bold text-white">Evidence Used</h5>
                      <div className="flex flex-col gap-2">
                        {['Vehicle Dynamics', 'Vehicle Trajectory', 'Collision Analysis', 'Road Geometry'].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 md:gap-3">
                            <div className="flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-md bg-[#22c55e]/20 text-[#22c55e]">
                              <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            </div>
                            <span className="text-xs md:text-sm text-slate-200">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 py-2.5 text-xs md:text-sm font-semibold text-white transition flex items-center justify-center gap-2">
                        Generate Report
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 py-2 text-[11px] md:text-[13px] font-medium text-slate-300 transition">
                          Compare
                        </button>
                        <button className="rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 py-2 text-[11px] md:text-[13px] font-medium text-slate-300 transition">
                          Confidence
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>

          {!['scenarios', 'heatmap'].includes(activeTab) && (
            <div className="px-4 py-5 border-t border-white/10 bg-[#0b1122]/95 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#7c3aed] text-white shadow-[0_20px_40px_rgba(124,58,237,0.28)] transition hover:bg-[#8b5cf6]">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button onClick={() => setCurrentTime(0.0)} className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#d1d5db] hover:bg-white/10 transition">
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button onClick={() => setPlaybackSpeed(prev => prev === 1.0 ? 1.5 : prev === 1.5 ? 2.0 : 1.0)} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#e0def8] hover:bg-white/10 transition">
                    {playbackSpeed.toFixed(1)}x
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-full bg-white/5 px-4 py-3">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.02"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                        className="w-full accent-[#7c3aed] h-2 bg-transparent cursor-pointer"
                      />
                    </div>
                    <span className="min-w-[96px] text-right text-xs uppercase tracking-[0.24em] text-[#9ca3af]">{currentTime.toFixed(2)} / 10.00s</span>
                  </div>
                </div>

                <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#c084fc] hover:bg-white/10 transition">
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { id: 'orbit', label: 'Orbit', icon: <Video className="h-4 w-4" /> },
                  { id: 'top', label: 'Top', icon: <ArrowUp className="h-4 w-4" /> },
                  { id: 'front', label: 'Front', icon: <ArrowRight className="h-4 w-4" /> },
                  { id: 'left', label: 'Left', icon: <ArrowLeft className="h-4 w-4" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCameraMode(item.id);
                      setActiveTab('3d');
                    }}
                    className={`rounded-3xl border px-4 py-3 text-sm transition flex flex-col items-center justify-center gap-2 ${cameraMode === item.id ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-white' : 'border-white/10 bg-white/5 text-[#e5e7eb] hover:bg-white/10'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}