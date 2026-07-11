import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Box, X, Navigation, LocateFixed, Plus, Minus } from 'lucide-react';

export default function MapView({ onBack }) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [layers, setLayers] = useState({
    roads: true,
    satellite: false,
    terrain: false,
    traffic: true,
    labels: true
  });
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="absolute inset-0 z-30 bg-[#090b14] overflow-hidden font-sans">
      {/* Map Background Simulation */}
      <div className={`absolute inset-0 transition-colors duration-700 ${layers.satellite ? 'bg-[#1a2e1d]' : 'bg-[#090b14]'}`}>
        {layers.satellite && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(34,139,34,0.1)_0%,_transparent_50%),radial-gradient(circle_at_80%_80%,_rgba(139,69,19,0.1)_0%,_transparent_50%)] opacity-80" style={{ filter: 'noise(2)' }} />
        )}
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Zoomable Content Wrapper */}
        <motion.div 
          className="absolute inset-0 w-full h-full origin-center"
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Simulated Roads */}
          <AnimatePresence>
            {layers.roads && (
              <motion.svg 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 1000 1000" 
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Main vertical-ish road */}
                <path d="M 400,-100 L 600,1100" stroke={layers.satellite ? "#1c2127" : "#1f2937"} strokeWidth="120" />
                <path d="M 400,-100 L 600,1100" stroke="#374151" strokeWidth="2" strokeDasharray="10 10" />
                
                {/* Main horizontal-ish road */}
                <path d="M -100,600 L 1100,400" stroke={layers.satellite ? "#1c2127" : "#1f2937"} strokeWidth="100" />
                <path d="M -100,600 L 1100,400" stroke="#374151" strokeWidth="2" strokeDasharray="10 10" />
                
                {/* Minor roads */}
                <path d="M 200,650 L 200,1100" stroke={layers.satellite ? "#14171c" : "#171e2e"} strokeWidth="60" />
                <path d="M 500,0 L 900,400" stroke={layers.satellite ? "#14171c" : "#171e2e"} strokeWidth="50" />
                <path d="M 700,1100 L 1000,800" stroke={layers.satellite ? "#14171c" : "#171e2e"} strokeWidth="60" />
              </motion.svg>
            )}
          </AnimatePresence>

          {/* Map Paths Overlay (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
            {/* Car A Path (Purple) */}
            <path d="M 200,200 Q 400,400 550,550" fill="none" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 8" className="opacity-80" />
            <circle cx="200" cy="200" r="15" fill="#7c3aed" className="drop-shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
            {layers.labels && <text x="200" y="205" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">1</text>}
            
            {/* Car A Trail Graphic */}
            <rect x="420" y="420" width="40" height="16" rx="4" fill="#7c3aed" transform="rotate(45, 440, 428)" opacity="0.6" />

            {/* Car B Path (Orange) */}
            <path d="M 250,850 Q 400,700 550,550" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="8 8" className="opacity-80" />
            <circle cx="250" cy="850" r="15" fill="#f97316" className="drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
            {layers.labels && <text x="250" y="855" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">2</text>}
            
            {/* Car B Trail Graphic */}
            <rect x="440" y="660" width="40" height="16" rx="4" fill="#f97316" transform="rotate(-45, 460, 668)" opacity="0.6" />

            {/* Impact Point */}
            <path d="M 540,540 L 560,560 M 560,540 L 540,560 M 550,530 L 550,570 M 530,550 L 570,550" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" className="drop-shadow-[0_0_20px_rgba(239,68,68,1)]" />
            <circle cx="550" cy="550" r="10" fill="#ef4444" className="animate-pulse" />
            
            {/* Simulated Traffic Dots (Optional) */}
            {layers.traffic && (
              <>
                <circle cx="450" cy="200" r="4" fill="#ef4444" opacity="0.7" />
                <circle cx="470" cy="220" r="4" fill="#ef4444" opacity="0.7" />
                <circle cx="250" cy="670" r="4" fill="#eab308" opacity="0.7" />
                <circle cx="270" cy="690" r="4" fill="#eab308" opacity="0.7" />
              </>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Floating Action Buttons (Right) */}
      <div className="absolute top-24 right-6 flex flex-col gap-4 z-40">
        <div className="flex flex-col bg-[#121626]/90 border border-white/10 rounded-full backdrop-blur-md shadow-xl overflow-hidden">
          <button onClick={handleZoomIn} className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition border-b border-white/10">
            <Plus className="w-5 h-5" />
          </button>
          <button onClick={handleZoomOut} className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition border-b border-white/10">
            <Minus className="w-5 h-5" />
          </button>
          <button onClick={() => setZoom(1)} className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition">
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>
        <button 
          onClick={() => setLayersOpen(!layersOpen)}
          className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition backdrop-blur-md shadow-xl ${layersOpen ? 'bg-[#7c3aed] text-white' : 'bg-[#121626]/90 text-white hover:bg-white/10'}`}
        >
          <Layers className="w-5 h-5" />
        </button>
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-[#121626]/90 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition backdrop-blur-md shadow-xl font-bold"
        >
          3D
        </button>
      </div>

      {/* Map Layers Bottom Sheet */}
      <AnimatePresence>
        {layersOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="absolute top-24 right-24 w-64 bg-[#0d111d]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl z-40"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-white text-sm font-semibold">Map Layers</h3>
              <button onClick={() => setLayersOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'roads', label: 'Roads', icon: <Map className="w-4 h-4" /> },
                { id: 'satellite', label: 'Satellite', icon: <Box className="w-4 h-4" /> },
                { id: 'terrain', label: 'Terrain', icon: <Box className="w-4 h-4" /> },
                { id: 'traffic', label: 'Traffic', icon: <Navigation className="w-4 h-4" /> },
                { id: 'labels', label: 'Labels', icon: <Box className="w-4 h-4" /> }
              ].map(layer => (
                <div key={layer.id} className="flex justify-between items-center cursor-pointer" onClick={() => toggleLayer(layer.id)}>
                  <div className="flex items-center gap-3 text-gray-300">
                    {layer.icon}
                    <span className="text-xs font-medium">{layer.label}</span>
                  </div>
                  {/* Toggle Switch */}
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${layers[layer.id] ? 'bg-[#7c3aed]' : 'bg-[#1e2436]'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${layers[layer.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Card - Scene Overview */}
      <div className="absolute bottom-6 left-6 w-[280px] bg-[#0d111d]/95 backdrop-blur-xl border border-white/10 rounded-[20px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" />
          <h3 className="text-white text-sm font-semibold">Scene Overview</h3>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-[10px] font-bold shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                1
              </div>
              <span className="text-gray-200 text-xs font-medium">Vehicle A</span>
            </div>
            <span className="text-gray-400 text-[11px]">Speed: ~45 km/h</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center text-white text-[10px] font-bold shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                2
              </div>
              <span className="text-gray-200 text-xs font-medium">Vehicle B</span>
            </div>
            <span className="text-gray-400 text-[11px]">Speed: ~38 km/h</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center text-[#ef4444]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
              </div>
              <span className="text-gray-200 text-xs font-medium">Impact Point</span>
            </div>
            <span className="text-gray-400 text-[11px]">Impact Time: 10:24:35 AM</span>
          </div>
        </div>
      </div>

    </div>
  );
}
