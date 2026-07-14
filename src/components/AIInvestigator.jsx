import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, CheckCircle2 } from 'lucide-react';
import { startInvestigation } from '../services/investigationPlannerService';

export default function AIInvestigator({ caseId }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('loading'); // loading, ready, error

  useEffect(() => {
    let mounted = true;

    const runOrchestrator = async () => {
      try {
        // Step 1: Loading
        if (mounted) setProgress(1);
        await new Promise(r => setTimeout(r, 1000)); // Simulate UI step

        // Step 2: Call the actual planner service
        if (mounted) setProgress(2);
        const context = await startInvestigation(caseId);
        
        // Step 3: Prepared context
        if (mounted) setProgress(3);
        await new Promise(r => setTimeout(r, 1000)); // Simulate UI step

        // Done
        if (mounted) setStatus('ready');
      } catch (err) {
        console.error("AI Investigator orchestration failed:", err);
        if (mounted) setStatus('error');
      }
    };

    runOrchestrator();

    return () => {
      mounted = false;
    };
  }, [caseId]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6 h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#121222]/90 border border-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        
        {status === 'loading' && (
          <>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 bg-accentTeal/20 blur-xl rounded-full" />
              <Loader className="w-16 h-16 text-accentTeal relative z-10" />
            </motion.div>
            
            <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-wider">
              AI Investigator
            </h2>
            
            <div className="space-y-4 w-full text-left ml-8">
              <div className={`flex items-center gap-3 ${progress >= 1 ? 'text-accentTeal' : 'text-gray-600'}`}>
                {progress > 1 ? <CheckCircle2 className="w-5 h-5" /> : (progress === 1 ? <Loader className="w-5 h-5 animate-spin" /> : <div className="w-5 h-5 rounded-full border border-gray-600" />)}
                <span className="text-sm font-mono">Loading investigation</span>
              </div>
              <div className={`flex items-center gap-3 ${progress >= 2 ? 'text-accentTeal' : 'text-gray-600'}`}>
                {progress > 2 ? <CheckCircle2 className="w-5 h-5" /> : (progress === 2 ? <Loader className="w-5 h-5 animate-spin" /> : <div className="w-5 h-5 rounded-full border border-gray-600" />)}
                <span className="text-sm font-mono">Reviewing extracted evidence</span>
              </div>
              <div className={`flex items-center gap-3 ${progress >= 3 ? 'text-accentTeal' : 'text-gray-600'}`}>
                {progress > 3 ? <CheckCircle2 className="w-5 h-5" /> : (progress === 3 ? <Loader className="w-5 h-5 animate-spin" /> : <div className="w-5 h-5 rounded-full border border-gray-600" />)}
                <span className="text-sm font-mono">Preparing investigation context</span>
              </div>
            </div>
          </>
        )}

        {status === 'ready' && (
          <>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
              <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10" />
            </motion.div>
            
            <h2 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">
              Investigation Ready
            </h2>
            <p className="text-gray-400 text-sm font-mono mt-2">
              Standing by for Dynamic Question Generator.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
