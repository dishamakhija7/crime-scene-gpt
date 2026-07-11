import React, { useState } from 'react';
import { ArrowLeft, Download, Share2, FileText, CheckCircle2, ChevronRight, AlertTriangle, Printer, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportPreview({ onTogglePDF, onGoToTimeline, onGoToEvidence, onGoBack }) {
  const [activeTab, setActiveTab] = useState('report'); // report, timeline, evidence

  const keyFindings = [
    { text: 'Traffic light was red for Car A', confidence: 85, level: 'High', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { text: 'Collision point confidence is high', confidence: 88, level: 'High', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { text: 'Pedestrian path is consistent', confidence: 92, level: 'High', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { text: 'Car B speed estimated around 38 km/h', confidence: 43, level: 'Medium', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Container */}
      <div className="bg-[#121222]/90 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-850 pb-4 gap-3">
          <div className="flex items-center gap-3">
            {onGoBack && (
              <button 
                onClick={onGoBack} 
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-800 bg-[#0b0b14] text-gray-400 hover:text-white hover:bg-gray-800 transition"
                title="Go Back to 3D Scene"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-mono text-accentTeal uppercase tracking-widest block">AI-Generated Analysis</span>
              <h2 className="text-xl font-bold text-white font-mono mt-0.5">INV-2025-0715</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Tab links to match mockup header */}
            <div className="flex bg-[#0b0b14] border border-gray-850 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1 text-xs font-mono rounded transition ${activeTab === 'report' ? 'bg-accentPurple text-white' : 'text-gray-400'}`}
              >
                Report
              </button>
              <button 
                onClick={onGoToTimeline}
                className="px-3 py-1 text-xs font-mono rounded text-gray-400 hover:text-white transition"
              >
                Timeline
              </button>
              <button 
                onClick={onGoToEvidence}
                className="px-3 py-1 text-xs font-mono rounded text-gray-400 hover:text-white transition"
              >
                Evidence
              </button>
            </div>
          </div>
        </div>

        {/* Main Split-Pane Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metadata Sidebar Panel */}
          <div className="md:col-span-1 bg-[#0b0b14]/50 border border-gray-850 rounded-xl p-4 space-y-4 h-fit">
            <h4 className="text-xs font-mono font-bold text-accentTeal uppercase tracking-wider">Case Details</h4>
            
            <div className="space-y-3 font-mono text-[11px] text-gray-400">
              <div>
                <span className="text-gray-500 block">CASE ID:</span>
                <span className="text-white font-bold">INV-2025-0715</span>
              </div>
              <div>
                <span className="text-gray-500 block">INCIDENT TYPE:</span>
                <span className="text-white font-medium">Vehicle Collision</span>
              </div>
              <div>
                <span className="text-gray-500 block">LOCATION:</span>
                <span className="text-white font-medium">City Road, MG Road</span>
              </div>
              <div>
                <span className="text-gray-500 block">DATE & TIME:</span>
                <span className="text-white font-medium">15 May 2025, 10:30 AM</span>
              </div>
              <div>
                <span className="text-gray-500 block">WEATHER:</span>
                <span className="text-white font-medium">Clear</span>
              </div>
              <div>
                <span className="text-gray-500 block">INVESTIGATING OFFICER:</span>
                <span className="text-white font-medium">Inspector Arjun</span>
              </div>
            </div>
          </div>

          {/* Main Analysis Pane */}
          <div className="md:col-span-2 space-y-6 text-left">
            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-sm font-mono font-bold text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accentTeal" /> Executive Summary
              </h3>
              <div className="bg-[#0b0b14]/30 border border-gray-850 p-4 rounded-xl text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                Based on the analyzed evidence, Scenario A is the most plausible collision with <span className="text-green-400 font-bold">82% probability</span>. Car A ran a red light and collided with the pedestrian. Car B swerved due to the impact and hit the divider.
              </div>
            </div>

            {/* Key Findings */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-gray-300 uppercase tracking-widest">Key Findings</h3>
              
              <div className="space-y-2.5">
                {keyFindings.map((finding, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start justify-between p-3.5 bg-[#0b0b14]/50 border border-gray-850 hover:border-gray-800 rounded-xl transition duration-200"
                  >
                    <div className="flex gap-2.5 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-accentTeal mt-1.5 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-200 leading-tight">{finding.text}</span>
                    </div>
                    
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider flex-shrink-0 ml-3 ${finding.color}`}>
                      {finding.confidence}% {finding.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons footer */}
        <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-850 pt-5">
          <button 
            onClick={onTogglePDF}
            className="flex-1 py-3 bg-[#0b0b14] hover:bg-[#0f0f20] border border-gray-800 hover:border-accentPurple text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-accentTeal" /> Download PDF
          </button>
          
          <button 
            className="flex-1 py-3 bg-accentPurple hover:bg-accentPurple/95 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition shadow-glowPurple border border-accentPurple/50 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share Report
          </button>
        </div>
      </div>
    </div>
  );
}
