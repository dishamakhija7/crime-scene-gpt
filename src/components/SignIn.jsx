import React, { useState } from 'react';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignIn({ onSignIn, onGoToSignUp }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('arjun@crimescene.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn();
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
          <h3 className="text-2xl font-bold text-white">Welcome Back 👋</h3>
          <p className="text-gray-400 text-xs mt-1">Sign in to continue your investigations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="relative">
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-[#0b0b14] border border-gray-800 focus:border-accentPurple text-white px-4 py-3 rounded-lg text-sm outline-none transition-all placeholder-transparent"
              id="email_input"
              placeholder="Email or Phone"
              required
            />
            <label 
              htmlFor="email_input"
              className="absolute left-4 top-3 text-xs text-gray-500 font-mono transition-all pointer-events-none
                peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-accentPurple
                peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-gray-400"
            >
              Email or Phone
            </label>
          </div>

          {/* Password field */}
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-[#0b0b14] border border-gray-800 focus:border-accentPurple text-white px-4 py-3 pr-10 rounded-lg text-sm outline-none transition-all placeholder-transparent"
              id="password_input"
              placeholder="Password"
              required
            />
            <label 
              htmlFor="password_input"
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

          {/* Forgot link */}
          <div className="flex justify-end">
            <a href="#" className="text-xs text-accentTeal hover:underline font-mono">Forgot Password?</a>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-accentPurple hover:bg-accentPurple/90 text-white rounded-lg font-mono text-sm tracking-wider font-bold transition duration-300 shadow-glowPurple border border-accentPurple/40"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-800" />
          <span className="text-[10px] font-mono text-gray-500 mx-3 uppercase tracking-wider">or continue with</span>
          <div className="flex-grow border-t border-gray-800" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 gap-4">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-[#0b0b14] border border-gray-800 hover:border-gray-700 rounded-lg text-xs font-mono text-gray-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
        </div>

        {/* Navigation bottom */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 font-mono">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={onGoToSignUp}
              className="text-accentPurple hover:underline font-bold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
