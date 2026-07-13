import React from 'react';
import { ChevronRight, User, Key, Bell, Shield, HelpCircle, Info, LogOut, Award, CheckCircle, FileText, Activity } from 'lucide-react';
import { motion as m } from 'framer-motion';

export default function Profile({ onLogout, onNavigate, currentUser }) {
  const settingsOptions = [
    { icon: <User className="w-5 h-5 text-accentTeal" />, label: 'Personal Information', action: 'personal' },
    { icon: <Key className="w-5 h-5 text-accentPurple" />, label: 'Change Password', action: 'password' },
    { icon: <Bell className="w-5 h-5 text-yellow-500" />, label: 'Notification Settings', action: 'notifications' },
    { icon: <Shield className="w-5 h-5 text-green-500" />, label: 'Linked Accounts', action: 'linked' },
    { icon: <HelpCircle className="w-5 h-5 text-blue-400" />, label: 'Help & Support', action: 'help' },
    { icon: <Info className="w-5 h-5 text-gray-400" />, label: 'About CrimeScene GPT', action: 'about' },
  ];

  const handleOptionSelect = (action) => {
    if (onNavigate) onNavigate(action);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {/* Profile Header */}
      <m.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121222]/80 border border-gray-800 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 shadow-lg"
      >
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full border-2 border-accentPurple overflow-hidden bg-gray-900 flex items-center justify-center">
          <img 
            src={currentUser?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
            alt={currentUser?.displayName || "Inspector Arjun"} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <User className="absolute w-10 h-10 text-gray-600" />
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-[#121222] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left flex-grow">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white">{currentUser?.displayName || 'Inspector Arjun'}</h2>
            <span className="bg-accentPurple/25 border border-accentPurple/50 text-accentTeal text-[9px] font-mono px-2 py-0.5 rounded-full">LEAD</span>
          </div>
          <p className="text-gray-400 text-xs mt-1 font-mono">{currentUser?.email || 'arjun@crimescene.com'}</p>
          <p className="text-gray-500 text-[10px] mt-1 font-mono">BADGE ID: {currentUser ? currentUser.uid.substring(0, 10).toUpperCase() : 'CS-98014-ARJ'}</p>
        </div>

        <button className="px-4 py-1.5 bg-[#0b0b14] border border-gray-800 hover:border-gray-700 text-xs font-mono rounded text-accentTeal transition">
          Edit Profile
        </button>
      </m.div>

      {/* Metrics Grid */}
      <m.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-[#121222]/80 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Investigations</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">28</div>
          <div className="text-[10px] text-accentTeal mt-1 flex items-center justify-center gap-1">
            <Activity className="w-3 h-3" /> Active: 3
          </div>
        </div>

        <div className="bg-[#121222]/80 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Completed</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">18</div>
          <div className="text-[10px] text-green-500 mt-1 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" /> Closed Cases
          </div>
        </div>

        <div className="bg-[#121222]/80 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">In Progress</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">7</div>
          <div className="text-[10px] text-yellow-500 mt-1 flex items-center justify-center gap-1">
            <FileText className="w-3 h-3" /> Processing
          </div>
        </div>

        <div className="bg-[#121222]/80 border border-gray-800 rounded-xl p-4 text-center">
          <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Accuracy</div>
          <div className="text-3xl font-extrabold text-accentTeal font-mono mt-1">92%</div>
          <div className="text-[10px] text-accentTeal mt-1 flex items-center justify-center gap-1">
            <Award className="w-3 h-3" /> High Confidence
          </div>
        </div>
      </m.div>

      {/* Settings list */}
      <m.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#121222]/80 border border-gray-800 rounded-xl divide-y divide-gray-800 overflow-hidden"
      >
        {settingsOptions.map((opt, idx) => (
          <button 
            key={idx} 
            onClick={() => handleOptionSelect(opt.action)}
            className="w-full flex items-center justify-between p-4 transition text-left group hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              {opt.icon}
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">{opt.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-accentTeal transition group-hover:translate-x-0.5" />
          </button>
        ))}
        
        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition text-left group text-red-500"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-500/70 group-hover:translate-x-0.5 transition" />
        </button>
      </m.div>
    </div>
  );
}
