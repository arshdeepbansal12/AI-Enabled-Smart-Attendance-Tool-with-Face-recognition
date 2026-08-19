import React, { useState } from 'react';
import { Fingerprint, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0a0e1a]">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-orb-1"></div>
        <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[150px] animate-orb-2"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px] animate-orb-3"></div>
      </div>

      {/* Decorative Lines (Desktop) */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/3 pointer-events-none">
        <div className="w-full h-full border-r border-white/[0.03] flex flex-col justify-between p-12">
          <div className="w-32 border-t border-white/[0.08] mt-24"></div>
          <div className="w-full flex items-center gap-4 opacity-20">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="flex-1 border-t border-white/20 border-dashed"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div className="w-48 border-b border-white/[0.08] mb-24"></div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6 animate-scale-in">
        <div 
          className="rounded-[1.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(15, 20, 40, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Logo Area */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-pulse-soft"></div>
              <div className="absolute inset-0 rounded-full border border-primary-500/30"></div>
              <Fingerprint className="w-8 h-8 text-primary-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">SmartAttend</h1>
            <p className="text-indigo-300 mt-1 font-medium">Teacher Portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-white/40 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-white/40 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/40 hover:text-white/70 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end pt-2">
                <a href="#" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full mt-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/30 font-medium tracking-wide uppercase">
              Powered by AI Face Recognition & GPS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
