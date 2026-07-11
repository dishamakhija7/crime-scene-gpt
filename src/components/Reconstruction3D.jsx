import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Video, Compass, ArrowUp, ArrowLeft, ArrowRight, Share2, MapPin } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

function BuildingBlock({ position, width = 5, depth = 5, height = 6, color = '#0f172a' }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.4} />
      </mesh>
      <group position={[0, height - 0.12, 0]}>
        {[...Array(4)].map((_, row) => (
          <group key={row} position={[0, 0, -depth / 2 + 0.85 + row * 1.2]}>
            {[...Array(3)].map((__, col) => (
              <mesh key={col} position={[-width / 2 + 0.8 + col * 1.6, 0, 0]}>
                <boxGeometry args={[0.6, 1.2, 0.12]} />
                <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.32} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <mesh position={[0, height + 0.12, 0]}>
        <boxGeometry args={[width * 1.06, 0.18, depth * 1.06]} />
        <meshStandardMaterial color="#111827" roughness={0.18} metalness={0.75} />
      </mesh>
    </group>
  );
}

function TrafficLight({ position, rotationY = 0, active = 'green' }) {
  const lights = [
    { color: '#ef4444', label: 'red' },
    { color: '#f59e0b', label: 'yellow' },
    { color: '#22c55e', label: 'green' }
  ];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.24, 2.8, 0.24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 2.7, 0.18]} castShadow>
        <boxGeometry args={[0.5, 1.1, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.4} />
      </mesh>
      {lights.map((light, idx) => (
        <mesh key={light.label} position={[0, 3.2 - idx * 0.34, 0.3]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color={light.color}
            emissive={light.color}
            emissiveIntensity={active === light.label ? 0.9 : 0.12}
          />
        </mesh>
      ))}
    </group>
  );
}

function ForensicRoadway() {
  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[170, 170]} />
        <meshStandardMaterial color="#07090f" roughness={1} metalness={0.08} />
      </mesh>

      <group position={[0, -0.06, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[80, 12]} />
          <meshStandardMaterial color="#1f2534" roughness={0.68} metalness={0.2} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 80]} />
          <meshStandardMaterial color="#1f2534" roughness={0.68} metalness={0.2} />
        </mesh>
      </group>

      <group position={[0, -0.045, 0]}>
        {[[0, 12.5], [0, -12.5], [12.5, 0], [-12.5, 0]].map((offset, idx) => (
          <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[offset[0], 0, offset[1]]}>
            <planeGeometry args={[28, 8]} />
            <meshStandardMaterial color="#1d2432" roughness={0.88} metalness={0.1} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0.04, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={`cross-x-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-3.9 + i * 1.0, 0, 6.1]}>
            <planeGeometry args={[0.6, 1.6]} />
            <meshStandardMaterial color="#fbfbfb" roughness={0.95} emissive="#fbfbfb" emissiveIntensity={0.08} />
          </mesh>
        ))}
        {[...Array(8)].map((_, i) => (
          <mesh key={`cross-z-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[6.1, 0, -3.9 + i * 1.0]}>
            <planeGeometry args={[1.6, 0.6]} />
            <meshStandardMaterial color="#fbfbfb" roughness={0.95} emissive="#fbfbfb" emissiveIntensity={0.08} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0.032, 0]}>
        {[[0, 4.15, 16], [0, -4.15, 16], [4.15, 0, 16], [-4.15, 0, 16]].map((line, idx) => (
          <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[line[0], 0, line[1]]}>
            <planeGeometry args={[line[2], 0.08]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.92} emissive="#e2e8f0" emissiveIntensity={0.05} />
          </mesh>
        ))}
        {[[4.15, 0, 16], [4.15, 0, -16], [16, 4.15, 0], [16, -4.15, 0]].map((line, idx) => (
          <mesh key={`side-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[line[0], 0, line[2]]}>
            <planeGeometry args={[0.08, line[2] === 0 ? 16 : 32]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.92} emissive="#e2e8f0" emissiveIntensity={0.05} />
          </mesh>
        ))}
      </group>

      <group>
        {[
          [-12, 0, -12, 1.2, 0.12],
          [12, 0, -12, 1.2, 0.12],
          [-12, 0, 12, 1.2, 0.12],
          [12, 0, 12, 1.2, 0.12]
        ].map(([x, y, z, w, h], idx) => (
          <mesh key={`sidewalk-${idx}`} position={[x, h, z]}>
            <boxGeometry args={[w, 0.24, 6.8]} />
            <meshStandardMaterial color="#111827" roughness={0.65} metalness={0.18} />
          </mesh>
        ))}
      </group>

      <group position={[0, 0.052, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[3.3, 3.3, 0.02, 64]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.09} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.1, 64]} />
          <meshStandardMaterial color="#8b5cf6" transparent opacity={0.06} />
        </mesh>
      </group>

      <group>
        {[
          [-18.6, 0, -18.6, 0.85],
          [18.6, 0, 18.6, Math.PI],
          [-18.6, 0, 18.6, Math.PI / 2],
          [18.6, 0, -18.6, -Math.PI / 2]
        ].map(([x, y, z, rot], idx) => (
          <TrafficLight key={idx} position={[x, 0, z]} rotationY={rot} active={idx % 2 === 0 ? 'green' : 'red'} />
        ))}
      </group>

      <group>
        {[
          [-22, 0, -22, 8, 8, 10, '#111827'],
          [22, 0, -22, 10, 7, 11, '#131a2d'],
          [-22, 0, 22, 8, 9, 9, '#0f172a'],
          [22, 0, 22, 9, 8, 12, '#0d1321'],
          [0, 0, -26, 7, 7, 9, '#121828'],
          [0, 0, 26, 6, 8, 8, '#121629']
        ].map(([x, y, z, w, d, h, color], idx) => (
          <BuildingBlock key={idx} position={[x, y, z]} width={w} depth={d} height={h} color={color} />
        ))}
      </group>
    </group>
  );
}

function VehicleBody({ texture, color, accent, scale = 1 }) {
  return (
    <group scale={[scale, scale, scale]}>
      <mesh castShadow receiveShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[2.3, 1.05, 4.5]} />
        <meshPhysicalMaterial map={texture} color={color} metalness={0.78} roughness={0.2} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh castShadow position={[0, 1.45, 0.12]}>
        <boxGeometry args={[1.8, 0.8, 2.2]} />
        <meshPhysicalMaterial color="#020617" metalness={0.85} roughness={0.12} />
      </mesh>
      <mesh position={[0, 1.18, 1.87]}>
        <boxGeometry args={[1.18, 0.36, 0.3]} />
        <meshPhysicalMaterial color={accent} emissive={accent} emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 1.18, -1.95]}>
        <boxGeometry args={[1.08, 0.3, 0.2]} />
        <meshPhysicalMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.32} />
      </mesh>
      <mesh position={[0, 1.1, -0.1]}>
        <boxGeometry args={[1.6, 0.5, 1.4]} />
        <meshPhysicalMaterial color="#111827" metalness={0.95} roughness={0.08} />
      </mesh>
      <mesh position={[0.95, 0.48, 1.35]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.4, 24]} />
        <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.24} />
      </mesh>
      <mesh position={[0.95, 0.48, -1.35]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.4, 24]} />
        <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.24} />
      </mesh>
      <mesh position={[-0.95, 0.48, 1.35]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.4, 24]} />
        <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.24} />
      </mesh>
      <mesh position={[-0.95, 0.48, -1.35]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.4, 24]} />
        <meshStandardMaterial color="#030712" metalness={0.95} roughness={0.24} />
      </mesh>
    </group>
  );
}

function SimulationScene({ isPlaying, playbackSpeed, currentTime, setCurrentTime, selectedScenario }) {
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
    if (!isPlaying) return;

    setCurrentTime((prev) => {
      const next = prev + (delta * playbackSpeed);
      return next >= 10.0 ? 0.0 : next;
    });

    const carASpeedMod = selectedScenario === 'B' ? 1.4 : 1.0;
    const impactActive = currentTime > collisionTime - 0.35 && currentTime < collisionTime + 0.8;

    if (carARef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        carARef.current.position.set(-20 + progress * 18.5 * carASpeedMod, 0.02, -2.0);
        carARef.current.rotation.y = THREE.MathUtils.lerp(0, 0.18, progress);
      } else {
        const diff = currentTime - collisionTime;
        carARef.current.position.set(-1.5 + diff * 1.5, 0.02, -2.0 + diff * 2.2);
        carARef.current.rotation.y = 0.24 + diff * 0.04;
      }
    }

    if (carBRef.current) {
      if (currentTime < collisionTime) {
        const progress = currentTime / collisionTime;
        carBRef.current.position.set(2.0, 0.02, 20 - progress * 18.2);
        carBRef.current.rotation.y = THREE.MathUtils.lerp(0, -Math.PI / 2 + 0.12, progress);
      } else {
        const diff = currentTime - collisionTime;
        carBRef.current.position.set(2.0 + diff * 3.8, 0.02, 1.8 - diff * 0.4);
        carBRef.current.rotation.y = -Math.PI / 2 + 0.14 + diff * 0.04;
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
      impactRef.current.scale.setScalar(impactActive ? 1.25 + Math.sin(state.clock.elapsedTime * 7) * 0.08 : 0.2);
      impactRef.current.rotation.z = state.clock.elapsedTime * 0.45;
    }

    if (dustRef.current) {
      dustRef.current.children.forEach((child, idx) => {
        child.position.y = 0.28 + Math.sin(state.clock.elapsedTime * 2 + idx) * 0.08;
        child.rotation.z = state.clock.elapsedTime * 0.3 + idx * 0.2;
      });
    }

    debrisRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const base = idx % 2 === 0 ? 0.08 : 0.12;
      mesh.position.y = impactActive ? 0.35 + Math.sin(state.clock.elapsedTime * 4 + idx) * 0.04 : 0.2;
      mesh.rotation.x += delta * base;
      mesh.rotation.y += delta * 0.05;
    });
  });

  return (
    <>
      <fog attach="fog" args={['#040a13', 10, 55]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#8fb8ff', '#07090e', 0.7]} />
      <directionalLight position={[14, 30, 12]} intensity={2.8} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-12, 16, 12]} intensity={16} angle={0.28} penumbra={0.55} color="#fbbf24" />
      <pointLight position={[8, 11, -8]} intensity={10} color="#38bdf8" distance={20} decay={2} />
      <pointLight position={[-8, 11, 8]} intensity={12} color="#f472b6" distance={20} decay={2} />

      <ForensicRoadway />

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
        <VehicleBody texture={carATexture} color="#b91c1c" accent="#fda4af" />
        <Html distanceFactor={14} position={[0, 2.9, 0]} center>
          <div className="bg-[#06070b]/90 border border-rose-500/80 text-white font-mono text-[10px] px-2 py-1 rounded shadow-2xl backdrop-blur-md select-none whitespace-nowrap">
            <span className="font-bold text-rose-400">Car A</span> • {selectedScenario === 'B' ? '55 km/h' : '43 km/h'}
          </div>
        </Html>
      </group>

      <group ref={carBRef} position={[2, 0.02, 20]}>
        <VehicleBody texture={carBTexture} color="#166534" accent="#86efac" />
        <Html distanceFactor={14} position={[0, 2.9, 0]} center>
          <div className="bg-[#06070b]/90 border border-emerald-500/80 text-white font-mono text-[10px] px-2 py-1 rounded shadow-2xl backdrop-blur-md select-none whitespace-nowrap">
            <span className="font-bold text-emerald-400">Car B</span> • 38 km/h
          </div>
        </Html>
      </group>

      <group ref={pedRef} position={[-3.5, 0.9, 5.5]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.24, 0.72, 6, 12]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.42} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.9, 0.85, 0.5]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <Html distanceFactor={11} position={[0, 1.9, 0]} center>
          <div className="bg-[#06070b]/90 border border-yellow-500/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap">
            <span className="text-yellow-400 font-bold">PEDESTRIAN</span>
          </div>
        </Html>
      </group>
    </>
  );
}

export default function Reconstruction3D({ onGoBack, onGoToReport, onGoToTimeline }) {
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
        camera.position.set(0, 34, 0.5);
        camera.up.set(0, 0, 1);
        break;
      case 'front':
        camera.position.set(0, 16, 30);
        camera.up.set(0, 1, 0);
        break;
      case 'left':
        camera.position.set(-30, 14, 0);
        camera.up.set(0, 1, 0);
        break;
      default:
        camera.position.set(0, 30, 20);
        camera.up.set(0, 1, 0);
        break;
    }

    camera.lookAt(target);
    controls.target.copy(target);
    controls.update();
  }, [cameraMode]);
  return (
    <div className="min-h-screen bg-[#080a13] text-white px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#c084fc]">Reconstruction (3D View)</p>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-[#0b0f1f]/80 shadow-[0_40px_120px_rgba(31,25,54,0.35)] backdrop-blur-xl overflow-hidden">
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
                { id: 'map', label: 'Map View' }
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

          <div className="relative bg-[#08101f] aspect-video md:h-[460px] overflow-hidden">
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_35%)]" />
            <Canvas camera={{ position: [0, 30, 20], fov: 38, near: 0.1, far: 120 }}>
              <color attach="background" args={['#06060a']} />
              <SimulationScene
                isPlaying={isPlaying} playbackSpeed={playbackSpeed}
                currentTime={currentTime} setCurrentTime={setCurrentTime}
                selectedScenario={selectedScenario}
              />
                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableRotate={true}
                  maxPolarAngle={Math.PI / 2.3}
                  minDistance={10}
                  maxDistance={50}
                />
            </Canvas>
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
          </div>

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
        </div>
      </div>
    </div>
  );
}