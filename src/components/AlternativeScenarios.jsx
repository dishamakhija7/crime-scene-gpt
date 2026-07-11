import React from 'react';
import { ArrowLeft, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlternativeScenarios({ onBack, onCompare, caseId = 'INV-2025-0715' }) {
  
  // A tiny SVG placeholder that looks like the intersection simulation
  const ThumbnailPlaceholder = ({ color, type }) => (
    <div className="w-full h-[220px] relative rounded-xl overflow-hidden bg-[#06080d] ring-1 ring-inset ring-white/5 group-hover:ring-white/20 transition-all duration-500">
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80" viewBox="250 150 500 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="thumb-asphalt" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#0a0e17" />
            <circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.03)" />
          </pattern>
          <pattern id="thumb-sidewalk" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#111827" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
          <radialGradient id="thumb-tree" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#022c22" />
          </radialGradient>
        </defs>
        
        {/* Base Asphalt */}
        <rect width="1000" height="800" fill="url(#thumb-asphalt)" />
        
        {/* Sidewalks */}
        <rect x="-50" y="-50" width="450" height="350" fill="url(#thumb-sidewalk)" rx="12" stroke="#374151" strokeWidth="2" />
        <rect x="600" y="-50" width="450" height="350" fill="url(#thumb-sidewalk)" rx="12" stroke="#374151" strokeWidth="2" />
        <rect x="-50" y="500" width="450" height="350" fill="url(#thumb-sidewalk)" rx="12" stroke="#374151" strokeWidth="2" />
        <rect x="600" y="500" width="450" height="350" fill="url(#thumb-sidewalk)" rx="12" stroke="#374151" strokeWidth="2" />
        
        {/* Road Markings */}
        <g fill="#9ca3af" opacity="0.4">
          {Array.from({length: 10}).map((_, i) => <rect key={`t-${i}`} x={418 + i*18} y="320" width="10" height="45" />)}
          {Array.from({length: 10}).map((_, i) => <rect key={`b-${i}`} x={418 + i*18} y="435" width="10" height="45" />)}
          {Array.from({length: 10}).map((_, i) => <rect key={`l-${i}`} x="320" y={418 + i*18 - 100} width="45" height="10" />)}
          {Array.from({length: 10}).map((_, i) => <rect key={`r-${i}`} x="635" y={418 + i*18 - 100} width="45" height="10" />)}
        </g>
        <line x1="500" y1="0" x2="500" y2="800" stroke="#f59e0b" strokeWidth="4" opacity="0.8" />
        <line x1="0" y1="400" x2="400" y2="400" stroke="#f59e0b" strokeWidth="4" opacity="0.8" />
        
        {/* Trees */}
        <circle cx="360" cy="250" r="28" fill="url(#thumb-tree)" />
        <circle cx="330" cy="275" r="22" fill="url(#thumb-tree)" />
        <circle cx="360" cy="550" r="30" fill="url(#thumb-tree)" />
        <circle cx="630" cy="240" r="26" fill="url(#thumb-tree)" />
        <circle cx="640" cy="540" r="28" fill="url(#thumb-tree)" />

        {/* Dynamic Vehicles & Trajectories based on Scenario Type */}
        {type === 'A' && (
          <g>
            <path d="M 750 420 L 515 400" stroke={color} strokeWidth="6" strokeDasharray="16,16" fill="none" opacity="0.8" />
            <path d="M 500 550 L 515 400" stroke="#10b981" strokeWidth="6" strokeDasharray="16,16" fill="none" opacity="0.5" />
            
            {/* Car A (Fleeing) */}
            <g transform="translate(430, 400) rotate(-10)">
              <rect x="-18" y="-35" width="36" height="70" rx="6" fill="#b91c1c" stroke="#000" strokeWidth="2"/>
            </g>
            {/* Car B (Struck) */}
            <g transform="translate(510, 420) rotate(80)">
              <rect x="-18" y="-35" width="36" height="70" rx="6" fill="#15803d" stroke="#000" strokeWidth="2"/>
            </g>
            <circle cx="510" cy="405" r="8" fill="#fff" opacity="0.9" />
          </g>
        )}

        {type === 'B' && (
          <g>
            <path d="M 650 440 L 515 400" stroke={color} strokeWidth="6" strokeDasharray="16,16" fill="none" opacity="0.8" />
            <path d="M 480 600 L 515 400" stroke="#10b981" strokeWidth="6" strokeDasharray="16,16" fill="none" opacity="0.5" />
            
            {/* Car A (Late brake, swerve) */}
            <g transform="translate(480, 380) rotate(-25)">
              <rect x="-18" y="-35" width="36" height="70" rx="6" fill="#b91c1c" stroke="#000" strokeWidth="2"/>
            </g>
            {/* Car B (Struck) */}
            <g transform="translate(530, 390) rotate(60)">
              <rect x="-18" y="-35" width="36" height="70" rx="6" fill="#15803d" stroke="#000" strokeWidth="2"/>
            </g>
            <circle cx="505" cy="385" r="8" fill="#fff" opacity="0.9" />
          </g>
        )}

        {type === 'C' && (
          <g>
            <path d="M 850 400 L 515 400" stroke={color} strokeWidth="6" strokeDasharray="16,16" fill="none" opacity="0.8" />
            <path d="M 520 600 L 515 400" stroke="#10b981" strokeWidth="6" strokeDasharray="16,16" fill="none" opacity="0.5" />
            
            {/* Car A (Mechanical Failure, straight through) */}
            <g transform="translate(420, 395) rotate(-90)">
              <rect x="-18" y="-35" width="36" height="70" rx="6" fill="#b91c1c" stroke="#000" strokeWidth="2"/>
            </g>
            {/* Car B (Struck, spinning) */}
            <g transform="translate(480, 330) rotate(140)">
              <rect x="-18" y="-35" width="36" height="70" rx="6" fill="#15803d" stroke="#000" strokeWidth="2"/>
            </g>
            <circle cx="515" cy="400" r="8" fill="#fff" opacity="0.9" />
          </g>
        )}

      </svg>
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-transparent to-[#06080c]/50 ring-1 ring-inset ring-white/10 rounded-xl" />
    </div>
  );

  return (
    <div className="absolute inset-0 z-30 bg-[#05050A]/95 backdrop-blur-xl flex flex-col items-center justify-center py-6 px-4 font-sans">
      
      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 25 }}
        className="w-full h-full bg-[#06080d] overflow-hidden flex flex-col"
      >
        {/* Header inside container */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0a0d16]">
          <h2 className="text-[#a78bfa] font-bold tracking-[0.2em] text-sm">ALTERNATIVE SCENARIOS</h2>
          <span className="font-mono text-sm tracking-wide text-gray-400">{caseId}</span>
        </div>

        {/* Scenarios List (Full width Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-[#06080d] overflow-y-auto flex-1 overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4c1d95 transparent' }}>
          
          {/* Scenario A (Green - Most Likely) */}
          <div className="group bg-[#111726]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#22c55e]/40 hover:bg-[#151c2e]/60 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(34,197,94,0.12)] flex flex-col gap-4">
            
            <ThumbnailPlaceholder color="#4ade80" type="A" />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-white font-bold text-lg">Scenario A <span className="text-gray-500 font-normal mx-1.5">-</span> <span className="text-[#4ade80]">82%</span></h2>
                <div className="bg-[#22c55e] text-[#05050a] text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded shadow-lg">
                  Most Likely
                </div>
              </div>
              <div className="text-gray-400 text-[12px] leading-relaxed">
                Car A ran the red light at 43 km/h and fled the scene.
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
              <span className="bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-1 rounded-md text-[10px] text-[#4ade80] font-semibold tracking-wide">Vehicle Path</span>
              <span className="bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-1 rounded-md text-[10px] text-[#4ade80] font-semibold tracking-wide">Speed</span>
              <span className="bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-1 rounded-md text-[10px] text-[#4ade80] font-semibold tracking-wide">Witness</span>
              <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">Signal</span>
            </div>
          </div>

          {/* Scenario B (Yellow) */}
          <div className="group bg-[#111726]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#eab308]/40 hover:bg-[#151c2e]/60 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(234,179,8,0.12)] flex flex-col gap-4">
            
            <ThumbnailPlaceholder color="#facc15" type="B" />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-white font-bold text-lg">Scenario B <span className="text-gray-500 font-normal mx-1.5">-</span> <span className="text-[#facc15]">13%</span></h2>
              </div>
              <div className="text-gray-400 text-[12px] leading-relaxed">
                Driver of Car A was distracted, braked late, and clipped Car B.
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
              <span className="bg-[#eab308]/10 border border-[#eab308]/20 px-2 py-1 rounded-md text-[10px] text-[#facc15] font-semibold tracking-wide">Vehicle Path</span>
              <span className="bg-[#eab308]/10 border border-[#eab308]/20 px-2 py-1 rounded-md text-[10px] text-[#facc15] font-semibold tracking-wide">Speed</span>
              <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">Witness</span>
              <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">Signal</span>
            </div>
          </div>

          {/* Scenario C (Red) */}
          <div className="group bg-[#111726]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#ef4444]/40 hover:bg-[#151c2e]/60 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(239,68,68,0.12)] flex flex-col gap-4">
            
            <ThumbnailPlaceholder color="#ef4444" type="C" />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-white font-bold text-lg">Scenario C <span className="text-gray-500 font-normal mx-1.5">-</span> <span className="text-[#ef4444]">5%</span></h2>
              </div>
              <div className="text-gray-400 text-[12px] leading-relaxed">
                Car A experienced mechanical brake failure before the intersection.
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
              <span className="bg-[#ef4444]/10 border border-[#ef4444]/20 px-2 py-1 rounded-md text-[10px] text-[#ef4444] font-semibold tracking-wide">Vehicle Path</span>
              <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">Speed</span>
              <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">Witness</span>
              <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide">Signal</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-5 pb-6 bg-[#0c101a]">
          <button 
            onClick={onCompare}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5b21b6] to-[#4c1d95] text-white font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(91,33,182,0.4)] hover:shadow-[0_0_30px_rgba(91,33,182,0.6)] transition-shadow border border-[#7c3aed]/30"
          >
            Compare Scenarios
          </button>
        </div>

      </motion.div>
    </div>
  );
}
