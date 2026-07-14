import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getInvestigationState } from '../services/investigationStateService';
import { CheckCircle2, Loader, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function CaseAnalysis({ caseId, onContinue }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchState = async () => {
      try {
        const data = await getInvestigationState(caseId);
        if (mounted) {
          setState(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching state for Case Analysis:", err);
      }
    };
    fetchState();
    return () => {
      mounted = false;
    };
  }, [caseId, onContinue]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 h-[80vh] flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-accentTeal" />
      </div>
    );
  }

  const { knownFacts = {}, reasoning = {}, missingFields = {}, confidenceScores = {} } = state || {};
  const overallConfidence = confidenceScores.overall || 0;

  // Filter out critical missing information (just showing keys that are missing)
  const criticalMissing = Object.keys(missingFields).filter(key => missingFields[key] === 'missing').slice(0, 4);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">Case Analysis</h2>
          <p className="text-gray-400 text-sm font-mono mt-1">Reviewing AI findings for Case: {caseId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Progress & Confidence */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#121222]/90 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-4">Investigation Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-mono">Evidence Uploaded</span>
              </div>
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-mono">Evidence Processed</span>
              </div>
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-mono">Facts Extracted</span>
              </div>
              <div className="flex items-center gap-3 text-accentTeal animate-pulse">
                <Loader className="w-5 h-5 animate-spin" />
                <span className="text-sm font-mono">Planning Investigation</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#121222]/90 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-2">Current Confidence</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-white font-mono">{Math.round(overallConfidence)}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full ${overallConfidence > 80 ? 'bg-green-500' : overallConfidence > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${overallConfidence}%` }}
              />
            </div>
          </motion.div>
        </div>

        {/* Middle Column: Extracted Facts & Findings */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#121222]/90 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accentTeal" /> Extracted Facts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(knownFacts).map(([key, value]) => (
                <div key={key} className="bg-black/40 border border-gray-800/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 font-mono capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-sm text-gray-200 font-semibold mt-1">
                    {Array.isArray(value) ? value.join(', ') : (value || 'N/A')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#121222]/90 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-4">AI Findings</h3>
              <ul className="space-y-3">
                {Object.values(reasoning).slice(0, 4).map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-accentTeal mt-0.5">•</span>
                    {note}
                  </li>
                ))}
                {Object.keys(reasoning).length === 0 && (
                  <li className="text-sm text-gray-500 italic">No significant findings recorded yet.</li>
                )}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#121222]/90 border border-red-900/30 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-red-500" />
              </div>
              <h3 className="text-red-400/80 text-sm font-mono uppercase tracking-widest mb-4 relative z-10">Critical Information Still Needed</h3>
              <ul className="space-y-3 relative z-10">
                {criticalMissing.map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm text-white/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </li>
                ))}
                {criticalMissing.length === 0 && (
                  <li className="text-sm text-gray-500 italic">No critical missing information.</li>
                )}
              </ul>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Bottom Actions */}
      {!state.reconstructionReady && (
        <div className="flex justify-end mt-8">
          <button 
            onClick={onContinue}
            className="flex items-center gap-2 px-8 py-4 bg-accentTeal text-black font-bold font-mono uppercase tracking-wider rounded-lg hover:bg-accentTeal/90 transition shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]"
          >
            Continue Investigation <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
