import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Eye, EyeOff, User, ArrowLeft, Lock } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/UPVIALOGO.svg';

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
        alert('Cek email Anda untuk link konfirmasi!');
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
    <div className="min-h-screen flex bg-[hsl(var(--brand-muted))] font-sans selection:bg-green-100 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Top-Center Alert */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card bg-white/90 border-red-100 p-4 rounded-2xl flex items-center gap-3 shadow-xl ring-1 ring-red-500/10"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {error.includes('Invalid login credentials') ? 'Email atau kata sandi salah. Silakan coba lagi.' : error}
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

      {/* Back button */}
      <Link to="/" className="fixed top-6 left-6 z-50 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[hsl(var(--brand-primary))] transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </Link>

      {/* Left Side: Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-sm w-full"
        >
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="Upvia Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">Upvia</span>
          </div>

          <header className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
              {isSignUp ? 'Mulai Sekarang.' : 'Selamat Datang!'}
            </h1>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
              Sederhanakan perjalanan belajar Anda dengan <span className="text-gray-900 font-bold">Upvia</span>. {isSignUp ? 'Daftar sekarang secara gratis.' : 'Masuk untuk melanjutkan pembelajaran Anda.'}
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleAuth}>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key="name"
                    className="relative overflow-hidden"
                  >
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Nama Lengkap"
                        className="w-full pl-14 pr-5 py-4 bg-white/50 backdrop-blur-sm border border-white rounded-2xl focus:border-[hsl(var(--brand-primary))] focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 text-sm premium-shadow"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Alamat Email"
                  className="w-full pl-14 pr-5 py-4 bg-white/50 backdrop-blur-sm border border-white rounded-2xl focus:border-[hsl(var(--brand-primary))] focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 text-sm premium-shadow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Kata Sandi"
                  className="w-full pl-14 pr-14 py-4 bg-white/50 backdrop-blur-sm border border-white rounded-2xl focus:border-[hsl(var(--brand-primary))] focus:ring-0 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 text-sm premium-shadow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end px-2">
                <button type="button" className="text-xs font-bold text-[hsl(var(--brand-primary))] hover:underline">
                  Lupa Kata Sandi?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 btn-primary rounded-2xl font-bold text-base active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-green-100"
            >
              {loading ? 'Memproses...' : isSignUp ? 'Daftar' : 'Masuk'}
            </button>

            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">atau lanjut dengan</span>
              <div className="flex-grow border-t border-gray-200"></div>
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
                  className="w-14 h-14 rounded-2xl border border-white bg-white/50 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:bg-white hover:scale-105 transition-all active:scale-95 shadow-sm premium-shadow"
                >
                  <social.icon className="w-6 h-6" />
                </button>
              ))}
            </div>
          </form>

          <footer className="mt-12 text-center text-gray-500 text-sm font-medium">
            {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
            {' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[hsl(var(--brand-primary))] font-bold hover:underline"
            >
              {isSignUp ? 'Masuk sekarang' : 'Daftar sekarang'}
            </button>
          </footer>
        </motion.div>
      </div>

      {/* Right Side: Illustrative Panel */}
      <div className="hidden lg:flex lg:w-[55%] p-6 items-stretch">
        <div className="flex-1 bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-sm border border-green-50">
          {/* Background Blobs for depth */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-green-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-10">
            {/* Person Meditation Mockup */}
            <div className="relative z-10 w-56 h-56 bg-green-50 animate-float rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative scale-90"
              >
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" className="text-green-200" />
                  <path d="M120 180C140 180 160 170 160 140C160 110 140 100 120 100C100 100 80 110 80 140C80 170 100 180 120 180Z" fill="#C1E1C1" stroke="#2D5A27" strokeWidth="3" />
                  <circle cx="120" cy="80" r="30" stroke="#2D5A27" strokeWidth="3" fill="#fff" />
                  <path d="M105 75C105 75 110 70 115 75" stroke="#2D5A27" strokeWidth="2" />
                  <path d="M125 75C125 75 130 70 135 75" stroke="#2D5A27" strokeWidth="2" />
                  <path d="M115 90C115 90 120 95 125 90" stroke="#2D5A27" strokeWidth="2" />
                  <path d="M80 140C60 140 50 120 40 130" stroke="#2D5A27" strokeWidth="3" strokeLinecap="round" />
                  <path d="M160 140C180 140 190 120 200 130" stroke="#2D5A27" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {/* Floating Avatar Circles */}
                <div className="absolute top-0 -left-6 w-10 h-10 bg-[#D1EBD1] rounded-full border-2 border-[#2D5A27] flex items-center justify-center overflow-hidden shadow-lg">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                </div>
                <div className="absolute bottom-1/4 -right-2 w-10 h-10 bg-[#FFDADA] rounded-full border-2 border-[#2D5A27] flex items-center justify-center overflow-hidden shadow-lg">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anya" alt="avatar" />
                </div>
              </motion.div>
            </div>

            {/* Floating Card UI */}
            <motion.div
              initial={{ x: -20, y: 30 }}
              animate={{ y: [30, 20, 30] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute left-6 bottom-16 bg-white p-5 rounded-[2rem] border-2 border-[#2D5A27] shadow-[6px_6px_0px_0px_#2D5A27] w-48 scale-95 z-20"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-base text-[#2D5A27] leading-tight text-left">Peta Jalan AI</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-left">12 Modul</p>
                </div>
                <div className="w-8 h-8 border-[3px] border-[#2D5A27] border-t-[#C1E1C1] rounded-full flex items-center justify-center text-[9px] font-black text-[#2D5A27]">
                  84%
                </div>
              </div>
              <div className="inline-block px-3 py-1 bg-[#C1E1C1] border-2 border-[#2D5A27] rounded-full text-[10px] font-black uppercase text-[#2D5A27]">
                Belajar
              </div>
            </motion.div>
          </div>

          <div className="text-center space-y-4 relative z-10">
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-green-100" />
              <div className="w-5 h-2.5 rounded-full bg-[hsl(var(--brand-primary))]" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-100" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              Buat proses belajar lebih mudah <br /> dan terorganisir dengan <span className="underline decoration-[hsl(var(--brand-primary))] decoration-[3px] underline-offset-4">Upvia</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Mentor cerdas Anda untuk pertumbuhan berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
