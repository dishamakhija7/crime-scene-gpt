import React, { useState } from 'react';
import { Clock, Play, Pause, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TimelineView({ onGoToReport, onGoToReconstruction }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  const timelineEvents = [
    {
      time: '10:14:58.120 AM',
      log: 'Car A (Red) approaches the intersection on City Road.',
      severity: 'medium',
      nodeColor: 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
      textColor: 'text-yellow-400',
      thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=60&h=45&q=80',
      telemetry: 'Speed: 45 km/h | Accel: -0.2 m/s²'
    },
    {
      time: '10:15:02.340 AM',
      log: 'Traffic light signal switches to RED for City Road lane.',
      severity: 'warning',
      nodeColor: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]',
      textColor: 'text-orange-400',
      thumbnail: 'https://images.unsplash.com/photo-1617469167446-8027ff207515?auto=format&fit=crop&w=60&h=45&q=80',
      telemetry: 'Signal state: Red (Active 0.5s)'
    },
    {
      time: '10:15:05.100 AM',
      log: 'Pedestrian initiates crossing on south crosswalk.',
      severity: 'info',
      nodeColor: 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
      textColor: 'text-green-400',
      thumbnail: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=60&h=45&q=80',
      telemetry: 'Crossing speed: 1.2 m/s'
    },
    {
      time: '10:15:07.050 AM',
      log: 'CRITICAL IMPACT: Collision occurs between Car A and Car B.',
      severity: 'critical',
      nodeColor: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse',
      textColor: 'text-red-400',
      thumbnail: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=60&h=45&q=80',
      telemetry: 'Delta V: 32 Gs | Contact Point: LF-Quarter'
    },
    {
      time: '10:15:08.400 AM',
      log: 'Car B (Green) swerves violently right, deflecting off vehicle A.',
      severity: 'medium',
      nodeColor: 'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
      textColor: 'text-yellow-400',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&h=45&q=80',
      telemetry: 'Yaw rate: 45°/s | Braking: 88%'
    },
    {
      time: '10:15:10.150 AM',
      log: 'SECONDARY IMPACT: Car B collides with the central concrete divider.',
      severity: 'critical',
      nodeColor: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]',
      textColor: 'text-red-400',
      thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=60&h=45&q=80',
      telemetry: 'Final velocity: 0 km/h | REST POSITION'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Timeline view container */}
      <div className="bg-[#121222]/90 border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-850 pb-4 mb-6 gap-3">
          <div>
            <span className="text-[10px] font-mono text-accentTeal uppercase tracking-widest block">Accident Telemetry Chronology</span>
            <h2 className="text-xl font-bold text-white font-mono mt-0.5">INV-2025-0715</h2>
          </div>
          <div className="flex bg-[#0b0b14] border border-gray-850 p-1 rounded-lg">
            <button 
              onClick={onGoToReconstruction}
              className="px-3 py-1 text-xs font-mono rounded text-gray-400 hover:text-white transition"
            >
              3D View
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 text-xs font-mono rounded transition ${activeTab === 'timeline' ? 'bg-accentPurple text-white' : 'text-gray-400'}`}
            >
              Timeline
            </button>
            <button 
              onClick={onGoToReport}
              className="px-3 py-1 text-xs font-mono rounded text-gray-400 hover:text-white transition"
            >
              Report View
            </button>
          </div>
        </div>

        {/* Timeline Log Flow */}
        <div className="relative border-l-2 border-gray-850 pl-6 ml-4 space-y-8 py-2">
          {timelineEvents.map((evt, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group text-left"
            >
              {/* Timeline dot node */}
              <div className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border border-[#121222] ${evt.nodeColor}`} />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0b0b14]/30 border border-gray-850/60 hover:border-gray-800 rounded-xl p-4 transition duration-300">
                {/* Time & Severity col */}
                <div className="md:col-span-1">
                  <span className={`text-[11px] font-mono font-bold block ${evt.textColor}`}>{evt.time}</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block mt-0.5">{evt.telemetry}</span>
                </div>

                {/* Log Description */}
                <div className="md:col-span-2 text-xs md:text-sm text-gray-300 leading-relaxed font-sans pr-2 self-center">
                  {evt.log}
                </div>

                {/* Micro-map/image Thumbnail */}
                <div className="md:col-span-1 flex items-center justify-end">
                  <div className="w-16 h-12 rounded border border-gray-800 overflow-hidden bg-gray-900 relative group-hover:border-accentTeal transition">
                    <img src={evt.thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" />
                    <div className="absolute inset-0 bg-accentPurple/10 opacity-30 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Timeline Playback Controller */}
        <div className="flex justify-center border-t border-gray-850 pt-5 mt-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-6 py-3 bg-accentPurple hover:bg-accentPurple/90 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg shadow-glowPurple border border-accentPurple/50 transition flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" /> Pause Timeline
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white pl-0.5" /> Play Timeline
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
