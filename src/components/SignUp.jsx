import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignUp({ onSignUp, onGoToSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('example@email.com');
  const [password, setPassword] = useState('********');
  const [agree, setAgree] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agree) {
      onSignUp();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-[#09090E] p-6 cyber-grid overflow-y-auto">
      {/* Radial glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accentPurple/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#121222]/90 border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accentPurple/50 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accentPurple/50 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accentPurple/50 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accentPurple/50 rounded-br-2xl" />

        {/* Small Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full border border-accentPurple bg-[#0b0b14] flex items-center justify-center mb-2 shadow-glowPurple">
            <ShieldAlert className="w-6 h-6 text-accentTeal" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wider font-mono">CRIMESCENE GPT</h2>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white">Create Account</h3>
          <p className="text-gray-400 text-xs mt-1">Join CrimeScene GPT</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name field */}
          <div className="relative">
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="peer w-full bg-[#0b0b14] border border-gray-800 focus:border-accentPurple text-white px-4 py-3 rounded-lg text-sm outline-none transition-all placeholder-transparent"
              id="fullname_input"
              placeholder="Full Name"
              required
            />
            <label 
              htmlFor="fullname_input"
              className="absolute left-4 top-3 text-xs text-gray-500 font-mono transition-all pointer-events-none
                peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-accentPurple
                peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-400"
            >
              Full Name
            </label>
          </div>

          {/* Email field */}
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-[#0b0b14] border border-gray-800 focus:border-accentPurple text-white px-4 py-3 rounded-lg text-sm outline-none transition-all placeholder-transparent"
              id="email_signup"
              placeholder="Email"
              required
            />
            <label 
              htmlFor="email_signup"
              className="absolute left-4 top-3 text-xs text-gray-500 font-mono transition-all pointer-events-none
                peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-accentPurple
                peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-400"
            >
              Email
            </label>
          </div>

          {/* Password field */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-[#0b0b14] border border-gray-800 focus:border-accentPurple text-white px-4 py-3 pr-10 rounded-lg text-sm outline-none transition-all placeholder-transparent"
              id="password_signup"
              placeholder="Password"
              required
            />
            <label 
              htmlFor="password_signup"
              className="absolute left-4 top-3 text-xs text-gray-500 font-mono transition-all pointer-events-none
                peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-accentPurple
                peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-400"
            >
              Password
            </label>
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 accent-accentPurple border-gray-800 rounded bg-[#0b0b14]"
            />
            <span className="text-[11px] text-gray-400 font-mono leading-tight">
              I agree to the <a href="#" className="text-accentTeal hover:underline">Terms & Conditions</a> and <a href="#" className="text-accentTeal hover:underline">Privacy Policy</a>
            </span>
          </label>

          {/* Create Account Button */}
          <button 
            type="submit" 
            disabled={!agree}
            className={`w-full py-3 text-white rounded-lg font-mono text-sm tracking-wider font-bold transition duration-300 border border-accentPurple/40 ${
              agree ? 'bg-accentPurple hover:bg-accentPurple/90 shadow-glowPurple' : 'bg-gray-800 cursor-not-allowed opacity-50'
            }`}
          >
            Create Account
          </button>
        </form>

        {/* Navigation bottom */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 font-mono">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={onGoToSignIn}
              className="text-accentPurple hover:underline font-bold"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
