import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GraduationCap, Mail, Eye, EyeOff, User } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';

export function Auth() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 relative">
      {/* Top-Center Alert */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-red-100 p-3.5 rounded-2xl flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-red-500/10"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-bold text-gray-900 leading-tight">
                {error.includes('Invalid login credentials') ? 'Invalid email or password. Please try again.' : error}
              </p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-gray-300 hover:text-gray-900 transition-colors px-1"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-sm w-full">
          <header className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
              {isSignUp ? 'Get Started.' : 'Welcome back!'}
            </h1>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Simplify your learning journey and boost your productivity with <span className="text-gray-900 font-bold">EduChain</span>. {isSignUp ? 'Join for free.' : 'Get started for free.'}
            </p>
          </header>

          <form className="space-y-5" onSubmit={handleAuth}>
            <div className="space-y-3.5">
              <AnimatePresence mode="popLayout">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 14 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    key="name"
                    className="relative overflow-hidden"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-full focus:border-gray-900 focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Username / Email"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-full focus:border-gray-900 focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-full focus:border-gray-900 focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end px-2">
              <button type="button" className="text-xs font-bold text-gray-900 hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black text-white rounded-full font-bold text-base hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-black/5"
            >
              {loading ? 'Processing...' : isSignUp ? 'Register' : 'Login'}
            </button>

            <div className="relative py-3 flex items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[11px] font-bold uppercase tracking-widest">or continue with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="flex justify-center gap-4">
              {[
                { icon: FaGoogle, name: 'Google', provider: 'google' as const },
                { icon: FaApple, name: 'Apple', provider: 'apple' as const },
              ].map((social) => (
                <button
                  key={social.name}
                  type="button"
                  onClick={() => handleOAuth(social.provider)}
                  className="w-12 h-12 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all active:scale-95 shadow-sm"
                >
                  <social.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {isSignUp ? 'Already a member?' : 'Not a member?'}
              {' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[#4F7942] font-bold hover:underline"
              >
                {isSignUp ? 'Login now' : 'Register now'}
              </button>
            </p>
          </footer>
        </div>
      </div>

      {/* Right Side: Illustrative Panel */}
      <div className="hidden lg:flex lg:w-[55%] p-6 items-stretch">
        <div className="flex-1 bg-[#F5F9F5] rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Mock Illustration Area */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-10">
            {/* Person Meditation Mockup */}
            <div className="relative z-10 w-56 h-56 bg-white/20 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative scale-90"
              >
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="120" cy="120" r="100" stroke="#000" strokeWidth="2" strokeDasharray="8 8" className="opacity-10" />
                  <path d="M120 180C140 180 160 170 160 140C160 110 140 100 120 100C100 100 80 110 80 140C80 170 100 180 120 180Z" fill="#C1E1C1" stroke="#000" strokeWidth="3" />
                  <circle cx="120" cy="80" r="30" stroke="#000" strokeWidth="3" fill="#fff" />
                  <path d="M105 75C105 75 110 70 115 75" stroke="#000" strokeWidth="2" />
                  <path d="M125 75C125 75 130 70 135 75" stroke="#000" strokeWidth="2" />
                  <path d="M115 90C115 90 120 95 125 90" stroke="#000" strokeWidth="2" />
                  <path d="M80 140C60 140 50 120 40 130" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                  <path d="M160 140C180 140 190 120 200 130" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {/* Floating Avatar Circles */}
                <div className="absolute top-0 -left-6 w-10 h-10 bg-[#D1EBD1] rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                </div>
                <div className="absolute bottom-1/4 -right-2 w-10 h-10 bg-[#FFDADA] rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anya" alt="avatar" />
                </div>
              </motion.div>
            </div>

            {/* Floating Card UI */}
            <motion.div
              initial={{ x: -20, y: 30 }}
              animate={{ y: [30, 20, 30] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute left-10 bottom-16 bg-white p-5 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-48 scale-95"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-base leading-tight">AI Roadmap</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">12 Modules</p>
                </div>
                <div className="w-8 h-8 border-[3px] border-black border-t-[#C1E1C1] rounded-full flex items-center justify-center text-[9px] font-black">
                  84%
                </div>
              </div>
              <div className="inline-block px-3 py-1 bg-white border-2 border-black rounded-full text-[10px] font-black uppercase">
                Learning
              </div>
            </motion.div>
          </div>

          <div className="text-center space-y-3">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              <div className="w-5 h-2.5 rounded-full bg-black" />
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              Make your work easier <br /> and organized with <span className="underline decoration-[#C1E1C1] decoration-[3px] underline-offset-4">EduChain</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
