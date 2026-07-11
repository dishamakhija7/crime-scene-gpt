import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Environment, SoftShadows } from '@react-three/drei';
import { ArrowLeft, Sparkles, MapPin, Share2, Video, ArrowUp, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import * as THREE from 'three';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
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
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.6, 6]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      {type === 'pine' ? (
        <group>
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[1.6, 2.5, 6]} />
            <meshStandardMaterial color="#064e3b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 3.4, 0]} castShadow>
            <coneGeometry args={[1.2, 2.0, 6]} />
            <meshStandardMaterial color="#065f46" roughness={0.8} />
          </mesh>
        </group>
      ) : (
        <group>
          <mesh position={[0, 2.8, 0]} castShadow>
            <dodecahedronGeometry args={[1.8, 0]} />
            <meshStandardMaterial color="#14532d" roughness={0.8} />
          </mesh>
          <mesh position={[0.8, 2.4, 0.8]} castShadow>
            <dodecahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          <mesh position={[-0.8, 2.6, -0.5]} castShadow>
            <dodecahedronGeometry args={[1.4, 0]} />
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Building({ position, width, height, depth, color }) {
  const isNight = true;
  return (
    <group position={position}>
      {/* Main Structure */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Roof detail */}
      <mesh position={[0, height + 0.2, 0]}>
        <boxGeometry args={[width * 1.02, 0.4, depth * 1.02]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Windows */}
      {isNight && (
        <group position={[0, 0, depth / 2 + 0.02]}>
          {Array.from({ length: Math.floor(height / 2.5) }).map((_, row) => (
            <group key={`row-${row}`} position={[0, height/2 + 2 - height/2 + row * 2.2, 0]}>
              {Array.from({ length: Math.floor(width / 1.8) }).map((_, col) => {
                const isLit = Math.random() > 0.6;
                return (
                  <mesh key={`col-${col}`} position={[-width / 2 + 1.2 + col * 1.8, 0, 0]}>
                    <planeGeometry args={[1.0, 1.4]} />
                    <meshStandardMaterial 
                      color={isLit ? "#fef08a" : "#0f172a"} 
                      emissive={isLit ? "#fef08a" : "#000000"} 
                      emissiveIntensity={isLit ? 2 : 0} 
                      roughness={0.1}
                      metalness={0.8}
                    />
                  </mesh>
                );
              })}
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
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.4, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.5} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 8, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.6} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.8, 7.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.6, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.6} />
      </mesh>
      {/* Lamp Head */}
      <mesh position={[1.6, 7.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Light Bulb */}
      <mesh position={[1.6, 7.8, 0]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={4} />
      </mesh>
      {/* Actual Light Source */}
      <spotLight position={[1.6, 7.8, 0]} angle={0.6} penumbra={0.5} intensity={2.5} color="#fef08a" distance={25} castShadow />
    </group>
  );
}

function ScooterBody({ color, scale = 1 }) {
  return (
    <group scale={[scale, scale, scale]}>
      {/* Base Deck */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.15, 1.8]} />
        <meshPhysicalMaterial color="#334155" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Front Column */}
      <mesh position={[0, 0.9, 0.8]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 1.45, 0.9]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Headlight */}
      <mesh position={[0, 1.45, 0.95]}>
        <boxGeometry args={[0.2, 0.1, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <spotLight position={[0, 1.45, 1.0]} target-position={[0, 0, 10]} angle={0.4} penumbra={0.5} intensity={15} distance={30} color="#fffaed" castShadow />
      
      {/* Seat Column */}
      <mesh position={[0, 0.7, -0.4]} rotation={[-0.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 1.0, -0.45]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.8]} />
        <meshPhysicalMaterial color="#020617" roughness={0.9} />
      </mesh>
      {/* Taillight */}
      <mesh position={[0, 0.9, -0.85]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 0.9, -0.9]} intensity={2} distance={5} color="#ff0000" />
      
      {/* Wheels */}
      {[[0, 0.25, 0.8], [0, 0.25, -0.7]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI/2]} position={[0.08, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI/2]} position={[-0.08, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function VehicleBody({ texture, color, accent, scale = 1 }) {
  return (
    <group scale={[scale, scale, scale]}>
      {/* Main Body */}
      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[2.3, 0.9, 4.6]} />
        <meshPhysicalMaterial map={texture} color={color} metalness={0.6} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Cabin / Roof */}
      <mesh castShadow position={[0, 1.65, -0.2]}>
        <boxGeometry args={[1.9, 0.6, 2.4]} />
        <meshPhysicalMaterial color={color} metalness={0.6} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.65, 1.01]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.7, 0.55]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Rear Window */}
      <mesh position={[0, 1.65, -1.41]} rotation={[0.2, Math.PI, 0]}>
        <planeGeometry args={[1.7, 0.55]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Side Windows */}
      <mesh position={[0.96, 1.65, -0.2]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[2.2, 0.5]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      <mesh position={[-0.96, 1.65, -0.2]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[2.2, 0.5]} />
        <meshPhysicalMaterial color="#020617" metalness={0.9} roughness={0.05} />
      </mesh>
      
      {/* Headlights & Taillights */}
      <mesh position={[0.7, 1.15, 2.31]}>
        <boxGeometry args={[0.6, 0.25, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.7, 1.15, 2.31]}>
        <boxGeometry args={[0.6, 0.25, 0.1]} />
        <meshPhysicalMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      
      <spotLight position={[0.7, 1.15, 2.4]} target-position={[0.7, 0, 15]} angle={0.5} penumbra={0.6} intensity={25} distance={50} decay={1.5} color="#fffaed" castShadow />
      <spotLight position={[-0.7, 1.15, 2.4]} target-position={[-0.7, 0, 15]} angle={0.5} penumbra={0.6} intensity={25} distance={50} decay={1.5} color="#fffaed" castShadow />
      
      <mesh position={[0.7, 1.15, -2.31]}>
        <boxGeometry args={[0.6, 0.25, 0.1]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.7, 1.15, -2.31]}>
        <boxGeometry args={[0.6, 0.25, 0.1]} />
        <meshPhysicalMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 1.15, -2.6]} intensity={5} distance={10} color="#ff0000" />
      
      {/* Wheels */}
      {[[1.05, 0.45, 1.5], [-1.05, 0.45, 1.5], [1.05, 0.45, -1.5], [-1.05, 0.45, -1.5]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI/2]} position={[(i % 2 === 0 ? 0.21 : -0.21), 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LowPolyCityEnvironment() {
  return (
    <group position={[0, 0, 0]}>
      {/* Base Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#020617" roughness={1} />
      </mesh>

      {/* Main Roads (Asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[16, 100]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Sidewalks */}
      {[
        [-29, -29], [29, -29], [-29, 29], [29, 29]
      ].map(([x, z], idx) => (
        <mesh key={`sidewalk-${idx}`} position={[x, 0.1, z]} receiveShadow castShadow>
          <boxGeometry args={[42, 0.3, 42]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
        </mesh>
      ))}

      {/* Center Double Lines */}
      <group position={[0, -0.03, 0]}>
        {[-30, 30].map(z => (
          <mesh key={`d-line-z-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]}>
            <planeGeometry args={[0.4, 40]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
          </mesh>
        ))}
        {[-30, 30].map(x => (
          <mesh key={`d-line-x-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, 0]}>
            <planeGeometry args={[40, 0.4]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
          </mesh>
        ))}
      </group>

      {/* Crosswalks (Zebra Stripes) */}
      <group position={[0, -0.03, 0]}>
        {[8, -8].map(zOffset => 
          Array.from({length: 10}).map((_, i) => (
            <mesh key={`cw-z-${zOffset}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-6.75 + i * 1.5, 0, zOffset]}>
              <planeGeometry args={[0.8, 3]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.2} />
            </mesh>
          ))
        )}
        {[8, -8].map(xOffset => 
          Array.from({length: 10}).map((_, i) => (
            <mesh key={`cw-x-${xOffset}-${i}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[xOffset, 0, -6.75 + i * 1.5]}>
              <planeGeometry args={[0.8, 3]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.2} />
            </mesh>
          ))
        )}
      </group>

      {/* Buildings */}
      <group>
        <Building position={[-16, 0, -20]} width={10} depth={18} height={14} color="#334155" />
        <Building position={[-30, 0, -14]} width={16} depth={10} height={20} color="#0f172a" />
        <Building position={[-28, 0, -28]} width={12} depth={12} height={10} color="#1e293b" />
        
        <Building position={[18, 0, -18]} width={12} depth={14} height={22} color="#0f172a" />
        <Building position={[32, 0, -16]} width={14} depth={10} height={16} color="#334155" />
        
        <Building position={[-18, 0, 18]} width={14} depth={12} height={12} color="#1e293b" />
        <Building position={[-32, 0, 24]} width={12} depth={14} height={18} color="#0f172a" />
        
        <Building position={[16, 0, 20]} width={10} depth={16} height={15} color="#334155" />
        <Building position={[30, 0, 24]} width={16} depth={12} height={10} color="#0f172a" />
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

function SimulationScene({ isPlaying, playbackSpeed, currentTime, setCurrentTime, selectedScenario, activeTab, onComplete }) {
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
      if (next >= 10.0) {
        onComplete?.();
        return 10.0;
      }
      return next;
    });

    const carASpeedMod = selectedScenario === 'B' ? 1.4 : 1.0;
    const impactActive = currentTime > collisionTime - 0.35 && currentTime < collisionTime + 0.8;

    if (carARef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        carARef.current.position.set(-25 + progress * 23.5 * carASpeedMod, 0.02, -2.0);
        carARef.current.rotation.y = 0;
      } else {
        const diff = currentTime - collisionTime;
        if (selectedScenario === 'A') {
          carARef.current.position.set(-1.5 + diff * 18, 0.02, -2.0 + diff * 2.5);
          carARef.current.rotation.y = 0.15;
        } else if (selectedScenario === 'B') {
          carARef.current.position.set(-1.5 + diff * 6, 0.02, -2.0 + diff * 4.5);
          carARef.current.rotation.y = 0.6;
        } else {
          carARef.current.position.set(-1.5 + diff * 12, 0.02, -2.0);
          carARef.current.rotation.y = 0;
        }
      }
    }

    if (carBRef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        carBRef.current.position.set(2.0, 0.02, 25 - progress * 23.2);
        carBRef.current.rotation.y = -Math.PI / 2;
      } else {
        const diff = currentTime - collisionTime;
        if (selectedScenario === 'A') {
          carBRef.current.position.set(2.0 + diff * 4.5, 0.02, 1.8 - diff * 3);
          carBRef.current.rotation.y = -Math.PI / 2 + diff * 4;
        } else if (selectedScenario === 'B') {
          carBRef.current.position.set(2.0 + diff * 2.5, 0.02, 1.8 - diff * 1.5);
          carBRef.current.rotation.y = -Math.PI / 2 + diff * 1.5;
        } else {
          carBRef.current.position.set(2.0 + diff * 8, 0.02, 1.8 - diff * 5);
          carBRef.current.rotation.y = -Math.PI / 2 + diff * 8;
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

    const postCollision = currentTime > collisionTime && currentTime < collisionTime + 2.5;
    if (dustRef.current) {
      dustRef.current.visible = postCollision;
      if (postCollision) {
        dustRef.current.children.forEach((child, idx) => {
          child.position.y = 0.28 + Math.sin(state.clock.elapsedTime * 5 + idx) * 0.15;
          child.position.x += delta * (idx % 2 === 0 ? 1 : -1) * 2;
          child.position.z += delta * (idx % 3 === 0 ? 1 : -1) * 2;
          child.rotation.z += delta * 5;
        });
      }
    }
  });

  return (
    <>
      <fog attach="fog" args={['#06060a', 20, 200]} />
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[14, 30, 12]} intensity={1.5} color="#cbd5e1" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <Environment preset="night" />
      <LowPolyCityEnvironment />
      {activeTab !== 'heatmap' && (
        <>
          <group ref={impactRef} position={[0.2, 0.12, 0]}>
            <mesh><ringGeometry args={[0.3, 2.6, 64]} /><meshBasicMaterial color="#fde68a" transparent opacity={0.45} /></mesh>
          </group>
          <group ref={carARef} position={[-20, 0.02, -2]}><VehicleBody texture={carATexture} color="#0f172a" accent="#334155" /></group>
          <group ref={carBRef} position={[2, 0.02, 20]}><ScooterBody color="#3b82f6" /></group>
          <group ref={pedRef} position={[-3.5, 0.9, 5.5]}><mesh><capsuleGeometry args={[0.24, 0.72, 6, 12]} /><meshStandardMaterial color="#fbbf24" /></mesh></group>
        </>
      )}

      {activeTab === 'heatmap' && (
        <group position={[0, 0, 0]}>
          <HeatmapNode position={[18, 0.02, -2]} radius={8} color="#f59e0b" intensity={0.4} />
          <HeatmapNode position={[10, 0.02, -2]} radius={10} color="#f59e0b" intensity={0.6} />
          <HeatmapNode position={[2, 0.02, 15]} radius={8} color="#f59e0b" intensity={0.4} />
          <HeatmapNode position={[2, 0.02, 8]} radius={10} color="#f59e0b" intensity={0.6} />
          <HeatmapNode position={[2, 0.02, -2]} radius={14} color="#ef4444" intensity={0.8} />
        </group>
      )}
    </>
  );
}

export default function Reconstruction3D({ onGoBack }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0.0);
  const [selectedScenario, setSelectedScenario] = useState('A');
  const [activeTab, setActiveTab] = useState('3d');
  const [cameraMode, setCameraMode] = useState('orbit');
  const [reconstructionComplete, setReconstructionComplete] = useState(false);
  const controlsRef = useRef();

  useEffect(() => {
    setCurrentTime(0.0);
    setIsPlaying(true);
    setReconstructionComplete(false);
  }, [selectedScenario]);

  return (
    <div className="min-h-[100dvh] bg-[#05060A] text-white p-3 md:p-6 pb-24 md:pb-6 flex flex-col">
      <div className="mx-auto w-full max-w-[1400px] flex flex-col flex-1 gap-4 md:gap-6">
        <div className="flex-1 rounded-3xl md:rounded-[40px] border border-white/10 bg-[#0B0F19]/80 backdrop-blur-2xl overflow-hidden flex flex-col">
          <div className="relative bg-[#05070d] flex-1 min-h-[40vh] md:min-h-[60vh] w-full overflow-hidden flex flex-col">
            <Canvas camera={{ position: [-25, 28, 25], fov: 38, near: 0.1, far: 120 }}>
              <color attach="background" args={['#06060a']} />
              <SoftShadows size={25} samples={10} focus={0.5} />
              <SimulationScene 
                isPlaying={isPlaying} 
                playbackSpeed={playbackSpeed} 
                currentTime={currentTime} 
                setCurrentTime={setCurrentTime}
                selectedScenario={selectedScenario}
                activeTab={activeTab}
                onComplete={() => {
                  setIsPlaying(false);
                  setReconstructionComplete(true);
                }}
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
                <EffectComposer>
                  <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
                  <SSAO radius={0.2} intensity={20} luminanceInfluence={0.5} color="black" />
                </EffectComposer>
              </Canvas>
            </div>
            
            <AnimatePresence>
              {activeTab === 'map' && reconstructionComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute top-6 right-6 z-20 w-72 rounded-3xl border border-white/10 bg-[#060912]/90 p-4 text-sm text-slate-300 shadow-2xl"
                >
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
                </motion.div>
              )}

              {/* ALTERNATIVE SCENARIOS OVERLAY */}
              {activeTab === 'scenarios' && reconstructionComplete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-30"
                >
                  <AlternativeScenarios 
                    caseId="INV-2025-0715"
                    onBack={() => setActiveTab('3d')}
                    onCompare={() => setActiveTab('3d')}
                  />
                </motion.div>
              )}

              {/* HEATMAP OVERLAY */}
              {activeTab === 'heatmap' && reconstructionComplete && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center font-sans"
                >
                  
                  {/* FLOATING PANELS */}
                  
                  {/* Risk / Impact Probability (Top Left) */}
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-6 left-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[220px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl pointer-events-auto"
                  >
                    <div className="text-white text-[11px] font-bold tracking-wide mb-5">Risk / Impact Probability</div>
                    <div className="flex gap-4">
                      <div className="w-4 h-36 rounded-full bg-gradient-to-b from-[#ff0000] via-[#ffff00] via-[#00ff00] to-[#00aaff]" />
                      <div className="flex flex-col justify-between h-36 text-[11px] text-gray-300 font-medium">
                        <span>High</span>
                        <span>Low</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Layers (Top Right) */}
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-6 right-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[200px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl pointer-events-auto"
                  >
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
                  </motion.div>

                  {/* Scenario Confidence (Bottom Left) */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-6 left-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[220px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl pointer-events-auto"
                  >
                    <div className="text-white text-[11px] font-bold tracking-wide mb-2">Scenario Confidence</div>
                    <div className="text-[#00E5FF] text-[38px] font-bold leading-none mb-1">94%</div>
                    <div className="text-[#00E5FF] text-[10px] mb-3 tracking-wide">High Confidence</div>
                    <div className="w-[140px] h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-[#00E5FF]" />
                    </div>
                  </motion.div>

                  {/* Legend (Bottom Right) */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-6 right-6 bg-[#0B0F19]/60 border border-white/5 rounded-2xl p-5 w-[220px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl pointer-events-auto"
                  >
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
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

          {!['scenarios', 'heatmap'].includes(activeTab) && (
            <div className="px-4 py-5 border-t border-white/10 bg-[#0b1122]/95 space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#7c3aed] text-white shadow-[0_20px_40px_rgba(124,58,237,0.28)] transition hover:bg-[#8b5cf6]">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button onClick={() => { setCurrentTime(0.0); setIsPlaying(true); setReconstructionComplete(false); }} className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-[#d1d5db] hover:bg-white/10 transition">
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
                        onChange={(e) => {
                           setCurrentTime(parseFloat(e.target.value));
                           if (parseFloat(e.target.value) < 10) setReconstructionComplete(false);
                        }}
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