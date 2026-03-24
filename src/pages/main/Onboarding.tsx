import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { generateRoadmap } from '../../lib/gemini';
import { db } from '../../lib/db';
import { Sparkles, ArrowRight, Loader2, Target, Zap, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function Onboarding() {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !user) return;

    setLoading(true);
    try {
      const roadmapData = await generateRoadmap(goal);
      await db.createRoadmap(user.id, { ...roadmapData, goal });
      navigate('/');
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      alert(error.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-[hsl(var(--brand-primary))] rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-green-100">
          <Sparkles className="w-4 h-4" />
          Didukung oleh Gemini AI
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          Apa yang ingin Anda <span className="text-[hsl(var(--brand-primary))]">kuasai</span> hari ini?
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Beri tahu ambisi Anda, dan AI kami akan merancang peta jalan terstruktur yang dipersonalisasi untuk membawa Anda dari nol hingga ahli.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Contoh: Saya ingin menjadi Full Stack Developer kelas dunia yang ahli dalam React dan Sistem Terukur..."
            className="relative w-full h-56 p-10 text-xl border border-green-100 rounded-[2rem] shadow-2xl focus:ring-4 focus:ring-green-50 outline-none resize-none transition-all placeholder:text-gray-300 font-medium bg-white/80 backdrop-blur-sm"
            disabled={loading}
          />
          <div className="absolute bottom-6 right-8 text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI Siap
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !goal.trim()}
          className="w-full py-6 px-10 bg-[hsl(var(--brand-primary))] text-white rounded-[1.5rem] font-black text-xl hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-green-500/20 active:translate-y-0 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl shadow-green-900/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              Merancang masa depan Anda...
            </>
          ) : (
            <>
              <Sparkles className="w-8 h-8" />
              Buat Peta Jalan Saya
              <ArrowRight className="w-6 h-6 ml-2" />
            </>
          )}
        </button>
      </motion.form>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: 'Presisi', desc: 'Disesuaikan secara algoritmis dengan tingkat pengetahuan Anda saat ini.' },
          { icon: Zap, title: 'Kecepatan', desc: 'Fokus hanya pada hal yang penting. Langsung ke pembangunan keterampilan.' },
          { icon: Shield, title: 'Penguasaan', desc: 'Tantangan langkah demi langkah memastikan Anda benar-benar menguasai konsep.' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="glass-card bg-white/50 p-8 rounded-[2rem] border border-white/60 premium-shadow group hover:border-green-200 transition-all hover:translate-y-[-5px]"
          >
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:scale-110 transition-transform shadow-sm">
              <item.icon className="text-[hsl(var(--brand-primary))] w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
