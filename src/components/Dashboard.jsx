import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, Activity, CheckCircle2, Clock, Award, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCases } from '../services/firestore';

export default function Dashboard({ onNewInvestigation, onSelectCase, onOpenCases, onNewCase }) {
  const stats = [
    { label: 'Total Cases', value: '28', change: '+2 this week', icon: <Activity className="w-5 h-5 text-accentTeal" /> },
    { label: 'In Progress', value: '7', change: 'Processing', icon: <Clock className="w-5 h-5 text-yellow-500" /> },
    { label: 'Completed', value: '18', change: '82% solve rate', icon: <CheckCircle2 className="w-5 h-5 text-accentPurple" /> },
    { label: 'Accuracy', value: '92%', change: 'High confidence', icon: <Award className="w-5 h-5 text-green-500" /> },
  ];

  const [recentCases, setRecentCases] = useState([
    { id: 'INV-2025-0715', title: 'Vehicle Collision - City Rd', time: 'Today, 10:30 AM', status: 'In Progress', statusColor: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { id: 'INV-2025-0714', title: 'Pedestrian Hit & Run', time: 'Yesterday, 04:15 PM', status: 'Completed', statusColor: 'bg-accentPurple/20 border-accentPurple/50 text-accentTeal' },
    { id: 'INV-2025-0713', title: 'Intersection T-Bone', time: '12 May, 09:29 AM', status: 'In Progress', statusColor: 'bg-green-500/10 border-green-500/30 text-green-400' },
    { id: 'INV-2025-0712', title: 'Multi-Vehicle Pile-up', time: '11 May, 02:43 PM', status: 'Completed', statusColor: 'bg-accentPurple/20 border-accentPurple/50 text-accentTeal' },
  ]);

  useEffect(() => {
    const fetchRecentCases = async () => {
      try {
        const casesData = await getCases();
        if (casesData && casesData.length > 0) {
          const formatted = casesData.slice(0, 4).map(c => ({
            id: c.id,
            title: c.title || 'Untitled Case',
            time: new Date(c.createdAt).toLocaleString(),
            status: c.status || 'In Progress',
            statusColor: c.status === 'Completed' ? 'bg-accentPurple/20 border-accentPurple/50 text-accentTeal' : 'bg-green-500/10 border-green-500/30 text-green-400'
          }));
          setRecentCases(formatted);
        }
      } catch (err) {
        console.error("Error fetching cases for dashboard:", err);
      }
    };
    fetchRecentCases();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Hello, Inspector Arjun <span className="animate-wiggle">👋</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Let's uncover the truth today.</p>
        </div>
        
        {/* CTA */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewCase}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-accentTeal hover:bg-accentTeal/90 text-black font-mono text-xs tracking-wider uppercase font-bold rounded-lg shadow-glowTeal border border-accentTeal/50 transition"
          >
            <Plus className="w-4 h-4" /> New Case
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewInvestigation}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-accentPurple hover:bg-accentPurple/90 text-white font-mono text-xs tracking-wider uppercase font-bold rounded-lg shadow-glowPurple border border-accentPurple/50 transition"
          >
            <Plus className="w-4 h-4" /> New Investigation
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#121222]/80 border border-gray-800 rounded-xl p-4 flex items-start justify-between glass-card-hover"
          >
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</span>
              <div className="text-2xl font-extrabold text-white mt-1 font-mono">{stat.value}</div>
              <span className="text-[9px] font-mono text-gray-400 block mt-1">{stat.change}</span>
            </div>
            <div className="p-2 bg-[#0b0b14] border border-gray-800 rounded-lg">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case List Header */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accentTeal" /> Recent Investigations
        </h3>
        <button onClick={onOpenCases} className="text-xs text-accentTeal hover:underline font-mono">See All</button>
      </div>

      {/* Recent Cases */}
      <div className="space-y-3">
        {recentCases.map((c, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            whileHover={{ x: 4 }}
            onClick={() => onSelectCase(c.id)}
            className="w-full text-left bg-[#121222]/60 hover:bg-[#121222]/90 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-accentTeal shadow-glowTeal" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-white tracking-wide">{c.id}</span>
                  <span className="text-gray-600 text-xs">•</span>
                  <span className="text-xs text-gray-300 font-medium">{c.title}</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono mt-1">{c.time}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${c.statusColor}`}>
                {c.status}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
